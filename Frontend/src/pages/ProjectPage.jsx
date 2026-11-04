import React, { useEffect, useState } from 'react'
import Topbar from '../components/Topbar'
import ActivityBar from '../components/ActivityBar'
import { AnimatePresence,motion } from 'motion/react';
import Explorer from '../components/Explorer';
import { getProjectById } from '../features/project';
import { useDispatch } from 'react-redux';
import { setCurrentProject } from '../redux/projectSlice';
import { useParams } from 'react-router-dom';
import { getTree } from '../features/file';
import { Code2, Eye, Maximize, Minimize } from 'lucide-react';

function ProjectPage() {
  const {id}=useParams();
    const [showExplorer, setShowExplorer] = useState(false);
  const[showAiChat,setShowAiChat]=useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
   const[showPreview,setShowPreview]=useState(false)
   const[isPreviewFull,setIsPreviewFull]=useState(false);
   const[tree,setTree]=useState([]);
   const [mobilePanelOpen, setMobilePanelOpen] = useState("explorer");

   const dispatch=useDispatch();
   const handleGetProjects=async()=>{
    const data=await getProjectById(id);
    console.log(data);
    dispatch(setCurrentProject(data.project));
   }

   const loadTree=async()=>{
    const data=await getTree(id);
    console.log(data);
    setTree(data.data);
   }

   useEffect(()=>{
    handleGetProjects();
    loadTree();
   },[id])

  return (
    <div className='relative flex h-screen flex-col overflow-hidden bg-[#0a0a0c]'>
        <div className='pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-[140px]'/>
        <div className='pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-voilet-500/10 blur-[140px]'/>
        <Topbar 
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        />

        <div className='flex flex-1 overflow-hidden'>
          <div className='hidden md:block'>
          <ActivityBar
          showExplorer={showExplorer}
          setShowExplorer={setShowExplorer}
          showAiChat={showAiChat}
          setShowAiChat={setShowAiChat}
          showTerminal={showTerminal}
          setShowTerminal={setShowTerminal}
          />
          </div>
          <div className={`${mobilePanelOpen === "explorer" ? "flex" : "hidden"} w-full md:flex md:w-auto`}>

          <AnimatePresence initial={false}>
            {showExplorer && <Explorer
            projectId={id}
            tree={tree}
            reloadTree={loadTree}
             />}
          </AnimatePresence>
          </div>

<div className={`${mobilePanelOpen === "editor" ? "flex" : "hidden"} relative w-full min-w-0 flex-1 flex-col overflow-hidden border-x border-white/[0.06] md:flex`}>
<div className='pointer-events-none absolute right-2 top-2 z-40 flex items-center gap-1.5 sm:right-4 sm:top-3 sm:gap-2'>{showPreview && (<motion.div
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.9 }}
typeof="button"
onClick={() => setIsPreviewFull(!isPreviewFull)}
title={isPreviewFull ? "Exit Fullscreen" : "Fullscreen Preview"}
className="pointer-events-auto flex  items-center justify-center rounded-lg border border-white/10 bg-[#111113]/95 p-1.5 text-zinc-400  shadow-lg shadow-black/10 backdrop-blur hover:text-white sm:p-2">
  {isPreviewFull ? (
    <Minimize size={13}/>
  ) : (
    <Maximize size={13}/>
  )
  }
  <div
  className='pointer-events-auto flex items-center gap-0.5 rounded-lg border border-white/10 bg-[#111113]/95 p-1 shadow-lg shadow-black/40 backdrop-blur'
  >

    <button
    onClick={()=>{
      setShowPreview(false)
      setIsPreviewFull(false)
    }
}
    
    className={`relative flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${showPreview ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
    >
      {!showPreview && (
        <motion.div
        className='absolute inset-0 rounded-md bg-gradient-to-b from-zinc-700 to-zinc-800'
        transition={{type:"spring",duration:0.4,bounce:0.15}}
        />
      )}
      <Code2 size={13}/>
      Editor
    </button>

    <button
    onClick={()=>setShowPreview(true)}
    className={`relative flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${showPreview ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
    >
   {showPreview && (
        <motion.div
        className='absolute inset-0 rounded-md bg-gradient-to-b from-zinc-700 to-zinc-800'
        transition={{type:"spring",duration:0.4,bounce:0.15}}
        />
      )}
      <Eye size={13}/>
      Preview
    </button>

  </div>
</motion.div>)}</div>


</div>

        </div>
      
    </div>
  )
}

export default ProjectPage
