'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useToast } from '@/components/ui/use-toast'
import {useCompletion} from "ai/react"
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/schema/messageSchema'
import { useForm } from 'react-hook-form'
import * as z from "zod";
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react'
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'
import { motion } from "framer-motion";
import { TypewriterEffectSmooth  } from "../../../components/ui/typewriter-effect";
import { AuroraBackground } from "../../../components/ui/aurora-background";
const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";


const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ username: string }>();
  const username = params.username;
  const {toast} = useToast();

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggestmessages',
    initialCompletion: initialMessageString,
  });

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  }

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<apiResponse>('/api/sendmessage', {
        username,
        ...data,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const words = [
    {
      text: "Start",
    },
    {
      text: "getting",
    },
    {
      text: "messages",
    },
    {
      text: "with",
    },
    {
      text: "Cypher.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
    <div className="my-8 mx-2 md:mx-4 lg:mx-auto p-6 rounded w-full max-w-6xl relative z-10">
      <p className="text-4xl font-bold mb-6 text-center relative z-10">
        Public Profile Link
      </p>
      <p className="text-4xl font-bold mb-6 text-center pt-12 relative z-10">
        Public Profile Link
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center relative z-10">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8 relative z-10">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
      <TypewriterEffectSmooth words={words} className='flex justify-center items-center'/>
        <Link href={'/signup'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
    </motion.div>
    </AuroraBackground>
  )
}

export default page