'use client'
import React, { useRef, useState, useEffect } from 'react'
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
import { Share2, Download, Code } from 'lucide-react'
import { useToast } from './ui/use-toast'

export function ShareMessageModal({ message }: { message: Message }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [answer, setAnswer] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://cypher.itsrishabh.tech');
  const { toast } = useToast();

  const [showEmbedOptions, setShowEmbedOptions] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { 
        pixelRatio: 4, // 270x480 * 4 = exactly 1080x1920 (9:16 aspect ratio)
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

  const handleCopyHTML = () => {
    const url = `${baseUrl}/embed/card?q=${encodeURIComponent(message.content)}${answer ? `&a=${encodeURIComponent(answer)}` : ''}`;
    navigator.clipboard.writeText(`<iframe src="${url}" width="100%" height="220" style="border:none; border-radius: 0px; background: transparent;"></iframe>`);
    toast({
      title: "HTML Copied!",
      description: "Paste it directly into your HTML file.",
      className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black",
    });
    setShowEmbedOptions(false);
  }

  const handleCopyReact = () => {
    const url = `${baseUrl}/embed/card?q=${encodeURIComponent(message.content)}${answer ? `&a=${encodeURIComponent(answer)}` : ''}`;
    navigator.clipboard.writeText(`<iframe src="${url}" width="100%" height={220} style={{ border: 'none', borderRadius: '0px', background: 'transparent' }} />`);
    toast({
      title: "React Code Copied!",
      description: "Paste it directly into your React/Next.js component.",
      className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-cyan-300 text-black",
    });
    setShowEmbedOptions(false);
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-black text-3xl uppercase tracking-tighter text-black">Share to Story</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-6 mt-4">
          {/* Capture Area (Strict 9:16 Ratio) */}
          <div 
            ref={cardRef} 
            className="w-[270px] h-[480px] border-4 border-black relative overflow-hidden shadow-none shrink-0"
            style={{ borderRadius: '0px', backgroundColor: '#facc15', color: '#000000' }}
          >
            {/* Brutalist Pattern / Decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 border-l-4 border-b-4 border-black z-0" style={{ backgroundColor: '#3b82f6' }}></div>
            <div className="absolute bottom-[75px] left-4 w-10 h-10 border-4 border-black rounded-none z-0" style={{ transform: 'rotate(12deg)', backgroundColor: '#ec4899' }}></div>
            <div className="absolute top-[130px] -left-4 w-12 h-12 border-4 border-black rounded-none z-0" style={{ transform: 'rotate(-12deg)', backgroundColor: '#4ade80' }}></div>
            
            <div className="absolute top-[50px] bottom-[90px] left-4 right-4 flex flex-col items-center justify-center gap-3 z-10">
              {/* Question Box */}
              <div className="relative w-full" style={{ transform: 'rotate(-2deg)' }}>
                <div className="absolute top-[6px] left-[6px] w-full h-full z-0 border-4 border-black" style={{ backgroundColor: '#000000' }}></div>
                <div className="border-4 border-black p-3 w-full relative z-10" style={{ backgroundColor: '#ffffff' }}>
                  <p className="font-black text-lg break-words uppercase tracking-tight text-center leading-tight line-clamp-6" style={{ color: '#000000' }}>
                    {message.content}
                  </p>
                </div>
              </div>

              {/* Optional Answer Box */}
              {answer && (
                <div className="relative w-full" style={{ transform: 'rotate(1deg)' }}>
                  <div className="absolute top-[6px] left-[6px] w-full h-full z-0 border-4 border-black" style={{ backgroundColor: '#000000' }}></div>
                  <div className="border-4 border-black p-3 w-full relative z-10" style={{ backgroundColor: '#ec4899' }}>
                    <p className="font-black text-base break-words uppercase tracking-tight text-center leading-tight line-clamp-5" style={{ color: '#ffffff' }}>
                      {answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-[90px] border-t-4 border-black z-20 flex flex-col items-center justify-center" style={{ backgroundColor: '#facc15' }}>
              <p className="font-black text-2xl uppercase tracking-widest leading-none mb-1" style={{ color: '#000000' }}>CYPHER</p>
              <div className="font-bold text-[10px] px-2 py-0.5 uppercase" style={{ color: '#000000' }}>Send Anonymous Messages</div>
            </div>
          </div>
          
          <div className="w-full space-y-4">
            <div>
              <label className="font-bold uppercase text-xs mb-1 block">Your Answer (Optional)</label>
              <textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full resize-none h-20 p-3 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-bold focus:outline-none focus:ring-0 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow uppercase"
              />
            </div>
            
            {showEmbedOptions ? (
              <div className="flex flex-col gap-3 border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50">
                <p className="font-black text-sm uppercase text-center w-full">Select Format</p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopyHTML}
                    className="flex-1 bg-orange-400 hover:bg-orange-500 text-black border-4 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase text-xs py-5"
                  >
                    HTML
                  </Button>
                  <Button 
                    onClick={handleCopyReact}
                    className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black border-4 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase text-xs py-5"
                  >
                    React (JSX)
                  </Button>
                </div>
                <Button variant="ghost" onClick={() => setShowEmbedOptions(false)} className="w-full text-xs font-bold uppercase hover:bg-transparent hover:underline text-gray-500 p-0 h-auto">
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleDownload} 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-wider py-6"
                >
                  <Download className="mr-2 h-5 w-5" strokeWidth={3} /> Image
                </Button>
                
                <Button 
                  onClick={() => setShowEmbedOptions(true)} 
                  className="flex-1 bg-green-400 hover:bg-green-500 text-black border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-wider py-6"
                >
                  <Code className="mr-2 h-5 w-5" strokeWidth={3} /> Embed
                </Button>
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
