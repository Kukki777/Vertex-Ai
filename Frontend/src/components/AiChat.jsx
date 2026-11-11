import {  Send, Sparkles } from 'lucide-react';
import React from 'react'
import {motion} from "motion/react";


function AiChat() {
    const[messages,setMessages]=React.useState([]);
  return (
    <div className='flex w-80 shrink-0 flex-col border-l border-white/[0.06] bg-[#111113]/90 backdrop-blur-xl'>
        <div className='flex h-10 shrink-0 items-center gap-2 border-b border-white/[0.06] px-3'>
        <span className='text-xs font-semibold tracking-wider text-zinc-400'>VertexAI Chat</span>
        </div>
        <div className='flex-1 space-y-3 overflow-y-auto p-3'>
        {messages.length===0 && (
            <div className='mt-10 text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]'>
                    <Sparkles size={22} className='text-zinc-600' />
                </div>
                <p className='text-sm font-medium text-zinc-400'>What do you want to build?</p>
                <p className='mt-1.5 text-xs text-zinc-600'>Ak me to create or modify files.</p>
            </div>
        )}
        
    </div>

    <div className='border-t border-white/[0.06] p-3'>
    <div className='flex items-end gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 transition-colors focus-within:border-sky-400/40'>
    <textarea
    placeholder='Ask me to create or modify files...'
    className='flex-1 resize-none rounded-md bg-transparent text-[13px] text-zinc-200 placeholder:text-zinc-500 outline-none'
    rows={2}
    />
    <motion.button
    whileHover={{scale:1.03}}
    whileTap={{scale:0.97}}
    className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-b from-sky-500 to-sky-600  text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] transition-opacity hover:from-sky-400 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-40'
    >
        <Send size={14} />
    </motion.button>
    </div>
    </div>

    </div>
  )
}

export default AiChat;