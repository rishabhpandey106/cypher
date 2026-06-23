'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signinSchema } from "@/schema/signinSchema"
import { apiResponse } from "@/types/apiResponse"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, LoaderCircle } from "lucide-react"
import { signIn } from "next-auth/react"

const Signpage = () => {

  const {toast} = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });
  
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    const res = await signIn('credentials', {
      redirect : false,
      identifier : data.identifier,
      password : data.password
    })

    if(res?.error){
      toast({ 
        title: "Signin Failed",
        description: "Incorrect Username or Password",
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-400 text-black",
      })
      setIsSubmitting(false);
    }

    if(res?.url){
      window.location.replace("/dashboard");
    }
  }

  return (
    <div className="flex relative justify-center items-center min-h-screen antialiased bg-purple-500 selection:bg-yellow-400 selection:text-black overflow-hidden px-4 py-12">
      
      {/* Decorative Blocks */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 border-4 border-black rotate-12 z-0 hidden md:block"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500 border-4 border-black -rotate-6 z-0 hidden md:block"></div>

      <div className="w-full max-w-md p-8 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none relative z-10">
        <div className="text-center mb-8 border-b-4 border-black pb-6">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black transform -rotate-1 inline-block bg-yellow-400 px-2 py-1 border-2 border-black">
            Join Cypher
          </h1>
          <p className="text-xl font-bold uppercase tracking-tight text-gray-700">Signin to your secret adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-black uppercase text-black">Email/Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="EMAIL OR USERNAME" 
                      className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg p-6 uppercase placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-pink-500 focus-visible:shadow-[8px_8px_0px_0px_rgba(236,72,153,1)] transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-black uppercase text-black">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="PASSWORD" 
                      className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg p-6 uppercase placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-pink-500 focus-visible:shadow-[8px_8px_0px_0px_rgba(236,72,153,1)] transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-widest px-8 py-8 text-2xl mt-4"
            >
              {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <LoaderCircle className="mr-2 h-6 w-6 animate-spin"/>
                    PLEASE WAIT
                  </span>
                ) : (
                  <span>SIGN IN</span>
                )}
            </Button>
          </form>
      </Form>
      <div className="text-center mt-8 pt-6 border-t-4 border-black relative z-10">
        <p className="text-lg font-bold uppercase text-black">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-pink-600 hover:text-pink-800 hover:bg-pink-200 px-1 border-b-4 border-transparent hover:border-black transition-all">SignUp</Link>
        </p>
      </div>
      </div>
    </div>
  )
}

export default Signpage