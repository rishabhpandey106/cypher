'use client'
import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Message } from '@/models/User'
import { useToast } from './ui/use-toast'
import axios from 'axios'
import { apiResponse } from '@/types/apiResponse'
import dayjs from 'dayjs';
import { ShareMessageModal } from './ShareMessageModal';

type MessageCradProps = {
    message: Message,
    onDelete: (messageId: string) => void,
}

const MessageCard = ({message , onDelete}: MessageCradProps) => {
    const {toast} = useToast();
    const handleDeleteMessage = async () => {
        const res = await axios.delete<apiResponse>(`/api/deletemessage/${message._id}`);
        toast({
            title: "Message Deleted",
            className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-400 text-black",
        })
        onDelete(String(message._id))
    }

  return (
    <div className={`border-4 border-black p-6 md:p-8 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full relative ${message.isBoosted ? 'bg-pink-300' : 'bg-white'}`}>
        <div className="flex justify-between items-start mb-6">
            <div className={`${message.isBoosted ? 'bg-black text-yellow-400' : 'bg-yellow-400 text-black'} border-4 border-black px-3 py-1 uppercase font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2 flex items-center gap-2`}>
                {message.isBoosted ? '⚡ BOOSTED' : 'Secret Message'}
            </div>
            <AlertDialog>
                <AlertDialogTrigger render={
                    <Button className="bg-red-500 hover:bg-red-600 text-white border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all p-2 h-10 w-10">
                        <X className="h-6 w-6 font-bold" strokeWidth={3} />
                    </Button>
                } />
                <AlertDialogContent className="border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sm:rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-black uppercase text-2xl">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="font-bold text-black text-base">
                            This action cannot be undone. This will permanently delete your message.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:space-x-4">
                        <AlertDialogCancel className="border-4 border-black rounded-none font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all mt-4 sm:mt-0">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteMessage} className="bg-red-500 hover:bg-red-600 text-white border-4 border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

        <div className="flex-grow">
            <p className='text-2xl md:text-3xl font-black uppercase leading-tight mb-8 break-words text-black'>{message.content}</p>
        </div>

        <div className='flex flex-row justify-between items-end w-full border-t-4 border-black pt-4 mt-auto gap-4'>
            <p className='text-xs md:text-sm font-bold uppercase text-black bg-pink-300 border-2 border-black px-2 py-1 transform rotate-1 inline-block whitespace-nowrap overflow-hidden text-ellipsis max-w-[50%]'>
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </p>
            <div className="flex items-center">
                <ShareMessageModal message={message} />
            </div>
        </div>
    </div>
  )
}

export default MessageCard