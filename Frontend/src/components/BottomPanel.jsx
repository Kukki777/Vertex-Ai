import { TerminalSquare, X } from 'lucide-react';
import { motion } from 'motion/react';
function BottomPanel({projectId,onClose}) {
  return (
    <motion.div
    initial={{height:0,opacity:0}}
    animate={{height:256,opacity:1}}
    exit={{height:0,opacity:0}}
    transition={{duration:0.2,ease:"easeOut"}}
    className='flex shrink-0 flex-col overflow-hidden border-t border-white/[0.06] bg-[#111113]'
    >
        <div className='flex h-10 shrink-0 items-center justify-between border-b border-white/[0.06] px-3'>
        <div className='flex items-center gap-1'>
            <h2 className='relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold tracking-wide trasition-colors text-white'>
                <TerminalSquare size={13} className="relative" />
                <span className='relative uppercase'>Terminal</span>
            </h2>
        </div>

        <button onClick={onClose}
        className='rounded-md p-1 text-zinc-500  hover:text-white hover:bg-white/10'
        title='Close panel'
        >
            <X size={14} />
        </button>
        </div>
    </motion.div>
  )
}

export default BottomPanel