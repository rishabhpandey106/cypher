'use client'
import React, { useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Message } from '@/models/User'
import * as htmlToImage from 'html-to-image';
import { Share2, Download } from 'lucide-react'

export function ShareMessageModal({ message }: { message: Message }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      // Use html-to-image which has full modern CSS support (including OKLCH/LAB colors from Tailwind v4)
      const dataUrl = await htmlToImage.toPng(cardRef.current, { 
        pixelRatio: 2,
        backgroundColor: '#facc15'
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `cypher-message-${message._id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to generate image', error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={
        <Button 
          variant="outline" 
          size="icon" 
          title="Share Message" 
          className="ml-2 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      } />
      <DialogContent className="sm:max-w-md border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="font-black text-3xl uppercase tracking-tighter text-black">Share to Story</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-6 mt-4">
          {/* Capture Area */}
          <div 
            ref={cardRef} 
            className="w-[250px] h-[450px] border-4 border-black relative overflow-hidden shadow-none"
            style={{ borderRadius: '0px', backgroundColor: '#facc15', color: '#000000' }}
          >
            {/* Brutalist Pattern / Decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 border-l-4 border-b-4 border-black z-0" style={{ backgroundColor: '#3b82f6' }}></div>
            <div className="absolute bottom-[75px] left-4 w-10 h-10 border-4 border-black rounded-none z-0" style={{ transform: 'rotate(12deg)', backgroundColor: '#ec4899' }}></div>
            <div className="absolute top-[130px] -left-4 w-12 h-12 border-4 border-black rounded-none z-0" style={{ transform: 'rotate(-12deg)', backgroundColor: '#4ade80' }}></div>
            
            <div className="absolute top-[80px] bottom-[100px] left-6 right-6 flex items-center justify-center z-10">
              <div className="relative w-full" style={{ transform: 'rotate(-2deg)' }}>
                {/* Fake shadow */}
                <div className="absolute top-[8px] left-[8px] w-full h-full z-0 border-4 border-black" style={{ backgroundColor: '#000000' }}></div>
                <div className="border-4 border-black p-6 w-full relative z-10" style={{ backgroundColor: '#ffffff' }}>
                  <p className="font-black text-2xl break-words uppercase tracking-tight text-center leading-tight" style={{ color: '#000000' }}>
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-[90px] border-t-4 border-black z-20 flex flex-col items-center justify-center" style={{ backgroundColor: '#facc15' }}>
              <p className="font-black text-2xl uppercase tracking-widest leading-none mb-1" style={{ color: '#000000' }}>CYPHER</p>
              <div className="font-bold text-[10px] px-2 py-0.5 uppercase" style={{ color: '#000000' }}>Send Anonymous Messages</div>
            </div>
          </div>
          
          <Button 
            onClick={handleDownload} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none transition-all font-black uppercase tracking-wider text-xl py-8"
          >
            <Download className="mr-3 h-6 w-6" strokeWidth={3} /> Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
