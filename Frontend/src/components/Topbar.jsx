import { Code2, Eye, Folder } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import {motion} from "motion/react"

function Topbar({showPreview,setShowPreview}) {
    const {currentProject}=useSelector(state=>state.project)
   
  return (
    <div className='relative flex h-12 items-center justify-between border-b border-white/[0.06] bg-[#111113] px-4 backdrop-blur-xl transition-colors duration-300 dark:border-white/[0.06] dark:bg-white/[0.08]'>
        <div className='flex items-center gap-3'>
            <div className='text-white  text-lg font-bold overflow-hidden text-transparent'>
                Vertex AI
            </div>
            <div className='h-4 w-px bg-white/10'/>
            <div className='flex items-center gap-2'>
                <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[13px]'>
                        <Folder size={20} strokeWidth={2} className="relative fill-yellow-400 text-yellow-500" />
                </div>
                <div className='max-w-[220px] truncate text-sm font-medium text-zinc-400'>
                   {currentProject?.name || "No Project Selected"} 
                </div>

            </div>
            

        </div>

        <div className='flex items-center gap-1.5'>
            <motion.button
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
            onClick={()=>setShowPreview(!showPreview)}
            title={showPreview?"Show Editor":"Show Preview"}
            className={`relative flex items-center justify-center rounded-lg p-2 transition-colors duration-150 ${showPreview?"text-sky-400" :" text-zinc-400 hover:text-zinc-200"}`}           
            >
                <motion.div className='absolute inset-0 rounded-lg  bg-s=white/[0.06] dark:border-white/10 dark:bg-white/10'
                transition={{type:"spring",duration:0.35,bounce:0.15}}/>

            {showPreview?<Eye size={16} className='relative'/>:<Code2 size={16} className='relative'/>}
       
            </motion.button>

        </div>
    </div>
  )
}

export default Topbar
