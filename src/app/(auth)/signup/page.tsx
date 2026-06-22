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

const SignupPage = () => {

  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceCallback(setUsername, 500);
  const {toast} = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if(username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
      }
      try {
        const res = await axios.get<apiResponse>(`/api/uniqueusername?username=${username}`)
        setUsernameMessage(res.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<apiResponse>;
        setUsernameMessage(axiosError.response?.data.message ?? "Error while checking username")
      } finally {
        setIsCheckingUsername(false);
      }
    }

    checkUniqueUsername();
  }, [username])
  
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post<apiResponse>("/api/signup", data);
      toast({
        title: "Success",
        description: res.data.message,
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-400 text-black",
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      let errormsg = axiosError.response?.data.message
      toast({
        title: "Error",
        description: errormsg,
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-400 text-black",
      })
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex relative justify-center items-center min-h-screen bg-green-400 selection:bg-pink-400 selection:text-black overflow-hidden py-12 px-4">
      
      {/* Decorative Blocks */}
      <div className="absolute top-10 left-20 w-48 h-48 bg-pink-500 border-4 border-black rotate-6 z-0 hidden lg:block"></div>
      <div className="absolute bottom-10 right-20 w-40 h-40 bg-purple-500 border-4 border-black -rotate-12 z-0 hidden lg:block"></div>

      <div className="w-full max-w-md p-8 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none relative z-10">
        <div className="text-center mb-8 border-b-4 border-black pb-6">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black transform rotate-1 inline-block bg-yellow-400 px-2 py-1 border-2 border-black">
            Join Cypher
          </h1>
          <p className="text-xl font-bold uppercase tracking-tight text-gray-700">Signup for a secret adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-black uppercase text-black">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="USERNAME" 
                      className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg p-6 uppercase placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-blue-500 focus-visible:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] transition-all"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debouncedUsername(e.target.value)
                      }} 
                    />
                  </FormControl>
                  <div className="flex items-center gap-2 mt-2">
                    {
                      isCheckingUsername && <Loader2 className="animate-spin h-5 w-5 text-black"/>
                    }
                    {!isCheckingUsername && usernameMessage && (
                      <p className={`text-sm font-bold uppercase px-2 py-1 border-2 border-black inline-block ${
                              usernameMessage === 'Username is available'
                              ? 'bg-green-300 text-black'
                              : 'bg-red-300 text-black'
                          }`}> {usernameMessage} 
                      </p>
                    )}
                  </div>
                  <FormMessage className="font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-black uppercase text-black">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="EMAIL" 
                      className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg p-6 uppercase placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-blue-500 focus-visible:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] transition-all"
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
                      className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg p-6 uppercase placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-blue-500 focus-visible:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
            <Button 
              disabled={isSubmitting} 
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-widest px-8 py-8 text-2xl mt-4"
            >
              {
                isSubmitting ? (
                  <>
                  <LoaderCircle className="mr-2 h-6 w-6 animate-spin"/>
                  PLEASE WAIT
                  </>
                ) : ('SIGN UP')
              }
            </Button>
          </form>
      </Form>
      <div className="text-center mt-8 pt-6 border-t-4 border-black relative z-10">
        <p className="text-lg font-bold uppercase text-black">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 px-1 border-b-4 border-transparent hover:border-black transition-all">SignIn</Link>
        </p>
      </div>
      </div>
    </div>
  )
}

export default SignupPage