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
import { BackgroundBeams } from "@/components/ui/background-beams"

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
      console.log(username);
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
      console.log(res.data);
      toast({
        title: "Success",
        description: res.data.message
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error while signing up", error);
      const axiosError = error as AxiosError<apiResponse>
      let errormsg = axiosError.response?.data.message
      toast({
        title: "Error",
        description: errormsg,
        variant: "destructive"
      })
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex relative justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Cypher</h1>
          <p className="mb-4">Signup to start your secret adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      debouncedUsername(e.target.value)
                    }} />
                  </FormControl>
                  {
                    isCheckingUsername && <Loader2 className="animate-spin"/>
                  }
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`text-sm ${
                            usernameMessage === 'Username is available'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}> {usernameMessage} 
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
            <Button disabled={isSubmitting} type="submit">
              {
                isSubmitting ? (
                  <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                  Please Wait
                  </>
                ) : ('SignUp')
              }
            </Button>
          </form>
      </Form>
      <div className="text-center mt-4 relative z-10">
        <p>
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-600 hover:text-blue-800">SignIn</Link>
        </p>
      </div>
      </div>
      <BackgroundBeams />
    </div>
  )
}

export default SignupPage