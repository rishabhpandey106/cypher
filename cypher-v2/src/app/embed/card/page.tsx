import React from 'react'
import crypto from 'crypto';
import { Zap } from 'lucide-react';

export default async function EmbedCard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const a = typeof resolvedParams.a === 'string' ? resolvedParams.a : '';
  const b = typeof resolvedParams.b === 'string' ? resolvedParams.b : '';
  const sig = typeof resolvedParams.sig === 'string' ? resolvedParams.sig : '';

  if (!q) {
    return null;
  }

  // Cryptographically verify the boost amount
  let verifiedBoostAmount: string | null = null;
  if (b && sig) {
    const secret = process.env.NEXTAUTH_SECRET || 'default_secret_for_local_testing_only';
    const dataToSign = `${q}|${a}|${b}`;
    const expectedSig = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');

    if (expectedSig === sig) {
      verifiedBoostAmount = b;
    } else {
      console.warn("Embed signature verification failed. Stripping fake boost badge.");
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `body { background-color: transparent !important; margin: 0; padding: 0; overflow: hidden; }` }} />
      <div className="w-full h-full flex flex-col justify-center items-center bg-transparent p-4">

        <div className="w-full max-w-md flex flex-col gap-4">

          {/* Question Box (Left aligned) */}
          <div className="relative w-[90%] sm:w-[85%] self-start" style={{ transform: 'rotate(-1deg)' }}>
            <div className="absolute top-[4px] left-[4px] w-full h-full z-0 border-2 border-black" style={{ backgroundColor: '#000000' }}></div>
            <div className="border-2 border-black p-4 w-full relative z-10" style={{ backgroundColor: verifiedBoostAmount ? '#fef3c6' : '#ffffff' }}>

              {/* VIP Boost Badge */}
              {verifiedBoostAmount && (
                <div className="absolute -top-3 -right-3 bg-pink-500 border-2 border-black px-2 py-1 flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-3">
                  <Zap className="h-3 w-3 text-white fill-white mr-1" />
                  <span className="font-black text-xs text-white uppercase tracking-wider">BOOSTED ₹{verifiedBoostAmount}</span>
                </div>
              )}

              <p className="font-black text-sm sm:text-base break-words uppercase tracking-tight leading-tight text-black line-clamp-4" >
                {q}
              </p>
            </div>
          </div>

          {/* Optional Answer Box (Right aligned) */}
          {a && (
            <div className="relative w-[90%] sm:w-[85%] self-end" style={{ transform: 'rotate(1deg)' }}>
              <div className="absolute top-[4px] left-[4px] w-full h-full z-0 border-2 border-black" style={{ backgroundColor: '#000000' }}></div>
              <div className="border-2 border-black p-4 w-full relative z-10" style={{ backgroundColor: '#ec4899' }}>
                <p className="font-black text-sm sm:text-base break-words uppercase tracking-tight leading-tight text-white line-clamp-4">
                  {a}
                </p>
              </div>
            </div>
          )}

          {/* Cypher Branding */}
          <div className="flex justify-end w-full mt-1 pr-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black bg-yellow-400 border-2 border-black px-2 py-1 uppercase text-black hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              ⚡ Built with Cypher
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
