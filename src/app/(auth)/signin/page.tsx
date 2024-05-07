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
import { signupSchema } from "@/schema/signupSchema"
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
import { signinSchema } from "@/schema/signinSchema"
import { signIn } from "next-auth/react"
import { BackgroundBeams } from "@/components/ui/background-beams"

const Signpage = () => {

  const {toast} = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });
  
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const res = await signIn('credentials', {
      redirect : false,
      identifier : data.identifier,
      password : data.password
    })

    if(res?.error){
      toast({ 
        title: "Signin Failed",
        description: "Incorrect Username or Password",
        variant: "destructive"
      })
    }

    if(res?.url){
      router.replace("/dashboard");
    }
  }

  return (
    <div className="flex relative justify-center items-center min-h-screen antialiased ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Cypher</h1>
          <p className="mb-4">Signin to start your secret adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              SignIn
            </Button>
          </form>
      </Form>
      <div className="text-center mt-4 relative z-10">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:text-blue-800 relative z-10">SignUp</Link>
        </p>
      </div>
      </div>
      <BackgroundBeams />
    </div>
  )
}

export default Signpage