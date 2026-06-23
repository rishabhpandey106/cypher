'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useToast } from '@/components/ui/use-toast'
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

const EmbedProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ username: string }>();
  const username = params.username;
  const {toast} = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

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
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `body { background-color: transparent !important; }` }} />
      <div className="min-h-screen bg-transparent p-4 font-sans selection:bg-pink-500 selection:text-white flex flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-black mb-4 leading-tight text-center">
              Ask <span className="bg-pink-500 text-white px-1">@{username}</span>
            </h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="TYPE SECRET MESSAGE..."
                          className="resize-none h-24 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow text-base font-bold p-3 uppercase placeholder:text-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-bold uppercase text-xs" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  {isLoading ? (
                    <Button disabled className="bg-black text-white rounded-none border-4 border-black font-black uppercase tracking-widest px-4 py-4 text-sm w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      SENDING...
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading || !messageContent} className="bg-blue-500 hover:bg-blue-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-widest px-4 py-4 text-sm w-full">
                      <Send className="mr-2 h-4 w-4" strokeWidth={3} /> SEND IT
                    </Button>
                  )}
                </div>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <a 
                href="https://cypher.itsrishabh.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                Powered by Cypher
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmbedProfile
