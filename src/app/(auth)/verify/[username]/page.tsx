'use client'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schema/verifySchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
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

const VerifyPage = () => {
    const router = useRouter();
    const param = useParams<{username: string}>()
    const {toast} = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
            const res = await axios.post(`/api/verifycode`, {
                username: param.username,
                code: data.code
            })

            toast({
                title: "Verified",
                description: res.data.message
            })

            router.replace("/signin");
        } catch (error) {
            console.log("Error while verification ",error)
            const axiosError = error as AxiosError<apiResponse>
            let errormsg = axiosError.response?.data.message
            toast({
                title: "Error",
                description: errormsg,
                variant: "destructive"
            })
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className='text-center'>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
        <p className="mb-4">Enter the OTP sent to your mail</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="OTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyPage