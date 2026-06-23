'use client'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schema/verifySchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'

const VerifyPage = () => {
    const router = useRouter();
    const param = useParams<{username: string}>()
    const {toast} = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const res = await axios.post(`/api/verify`, {
                username: param.username,
                code: data.code
            })

            console.log("Verification response ",res.data)

            toast({
                title: "Verified",
                description: res.data.message,
                className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black",
            })

            window.location.replace("/signin");
        } catch (error) {
            console.log("Error while verification ",error)
            const axiosError = error as AxiosError<apiResponse>
            let errormsg = axiosError.response?.data.message
            toast({
                title: "Error",
                description: errormsg,
                variant: "destructive",
                className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-400 text-black",
            })
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-400 p-4">
      <div className="w-full max-w-md p-8 bg-white border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className='text-center mb-8 border-b-4 border-black pb-6'>
          <h1 className="text-4xl font-black uppercase tracking-tighter lg:text-5xl mb-2 text-black leading-none">
            Verify Your Account
          </h1>
          <p className="font-bold text-lg uppercase text-black">Enter the OTP sent to your mail</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase text-xl text-black">Verification Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ENTER OTP..." 
                      className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold p-6 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-none transition-all uppercase placeholder:text-gray-400 text-black"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="font-bold uppercase text-red-500 mt-2" />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full text-lg font-black uppercase tracking-wider py-8 bg-blue-500 hover:bg-blue-600 text-white border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" strokeWidth={3} />
                  Verifying...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyPage