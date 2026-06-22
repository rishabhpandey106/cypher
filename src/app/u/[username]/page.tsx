'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useToast } from '@/components/ui/use-toast'
import { useCompletion } from "ai/react"
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
import { Loader2, Send } from 'lucide-react'

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const Profile = () => {
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

  return (
    <div className="min-h-screen bg-yellow-400 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-pink-500 selection:text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-500 border-4 border-black rotate-12 z-0 hidden md:block"></div>
      <div className="absolute bottom-20 -right-10 w-40 h-40 bg-pink-500 border-4 border-black -rotate-6 z-0 hidden md:block"></div>

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Main Card */}
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none mb-12 mt-8 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 leading-tight">
            Send Anonymous Message To <br/><span className="bg-pink-500 text-white px-2 inline-block transform -rotate-2 mt-2 break-all">@{username}</span>
          </h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="TYPE YOUR SECRET MESSAGE HERE..."
                        className="resize-none h-32 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow text-lg font-bold p-4 uppercase placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-bold uppercase" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                {isLoading ? (
                  <Button disabled className="bg-black text-white rounded-none border-4 border-black font-black uppercase tracking-widest px-8 py-6 text-lg w-full md:w-auto">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    SENDING...
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading || !messageContent} className="bg-blue-500 hover:bg-blue-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-widest px-8 py-6 text-lg w-full md:w-auto">
                    <Send className="mr-2 h-6 w-6" strokeWidth={3} /> SEND IT
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>

        {/* Suggested Messages Section */}
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h3 className="text-2xl font-black uppercase tracking-tight">Need Inspiration?</h3>
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="bg-green-400 hover:bg-green-500 text-black rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase w-full md:w-auto disabled:opacity-80"
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" strokeWidth={3} />
                  SUGGESTING...
                </>
              ) : (
                "Suggest Messages"
              )}
            </Button>
          </div>
          
          <div className="flex flex-col space-y-3">
            {error ? (
              <p className="text-red-500 font-bold uppercase border-4 border-red-500 p-4 bg-red-100">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <button
                  key={index}
                  className="text-left w-full bg-gray-100 hover:bg-yellow-200 border-4 border-black p-4 font-bold text-lg transition-colors uppercase break-words"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16 mb-8">
          <div className="inline-block bg-black text-white p-6 border-4 border-black transform rotate-1 mb-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest leading-none">Want Your Own?</h2>
          </div>
          <br/>
          <Link href={'/signup'}>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all font-black uppercase tracking-widest px-10 py-8 text-xl md:text-2xl w-full md:w-auto">
              Create Cypher Link
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Profile