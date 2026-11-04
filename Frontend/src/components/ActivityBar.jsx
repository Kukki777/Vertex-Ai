
import React from 'react';
import { Files, Bot, SquareTerminal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function ActivityIcon({ icon: Icon, label, active, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        aria-label={label}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg"
      >
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/10 backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        <Icon
          size={20}
          strokeWidth={2}
          className={`relative z-10 transition-colors duration-150 ${
            active
              ? 'text-sky-400'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        />

        
<AnimatePresence>
  {active && (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.5 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0.5 }}
      transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
      className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-sky-400 to-violet-400"
    />
  )}
</AnimatePresence>


        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-none absolute left-11 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-[#17171a] px-2 py-1 text-[11px] font-medium text-zinc-300 shadow-lg shadow-black/40 dark:bg-zinc-800 dark:text-zinc-400 "
              
            >
                {label}
            </motion.div>

          )}
        </AnimatePresence>


        
      </motion.button>
    </div>
  );
}

function ActivityBar({showExplorer, setShowExplorer,showAiChat,setShowAiChat,showTerminal, setShowTerminal}) {
  return (
    <div className="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-white/[0.06] bg-[#111113]/90 px-2 pt-2">
      <ActivityIcon
        icon={Files}
        label={"Explorer"}
        active={showExplorer}
        onClick={() => setShowExplorer(!showExplorer)}
      />
      <ActivityIcon
        icon={Bot}
        label={"AI Chat"}
        active={showAiChat}
        onClick={() => setShowAiChat(!showAiChat)}
      />
      <div className='mt-auto flex flex-col items-center gap-2'>
        <div className='mb-1 h-px w-6 bg-white/[0.06]'/>
            <ActivityIcon
        icon={SquareTerminal}
        label={"Terminal"}
        active={showTerminal}
        onClick={() => setShowTerminal(!showTerminal)}
      />
      </div>
    </div>
  );
}

export default ActivityBar;
