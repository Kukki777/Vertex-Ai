import { useEffect, useState, useCallback } from "react";
import Topbar from "../components/Topbar";
import ActivityBar from "../components/ActivityBar";
import Explorer from "../components/Explorer";
import { AnimatePresence, motion } from "motion/react";
import { getProjectById } from "../features/project";
import { getTree } from "../features/file";
import { useDispatch } from "react-redux";
import { setCurrentProject } from "../redux/projectSlice";
import { useParams } from "react-router-dom";
import { Code2, Eye, Maximize, Minimize } from "lucide-react";
import Preview from "../components/Preview";
import Editor from "../components/Editor";

function ProjectPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showExplorer, setShowExplorer] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewFull, setIsPreviewFull] = useState(false);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobilePanelOpen, setMobilePanelOpen] = useState("editor");
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  // Fetch project
  const handleGetProjects = useCallback(async () => {
    try {
      const data = await getProjectById(id);
      dispatch(setCurrentProject(data.project));
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Unable to load project");
    }
  }, [id, dispatch]);

  const loadTree = useCallback(async () => {
    try {
      const data = await getTree(id);
      setTree(data.data || []);
    } catch (error) {
      console.error("Error loading file tree:", error);
    }
  }, [id]);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      setError("");
      await Promise.all([handleGetProjects(), loadTree()]);
      setLoading(false);
    };

    loadProject();
  }, [handleGetProjects, loadTree]);

  const openFile=(file)=>{
   const exist=openTabs.find((tab)=>tab._id===file._id);
   if(!exist)
    setOpenTabs(prev=>[...prev,file]);
   setActiveTab(file);
   setShowPreview(false);
  }

  const handleEditor = () => {
    setShowPreview(false);
    setIsPreviewFull(false);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };
  const handleFullscreen = () => {
    setIsPreviewFull((prev) => !prev);
  };
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#0a0a0c]">
      {/* Background effects */}
      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-[140px]" />
      {/* Topbar */}
      <Topbar showPreview={showPreview} setShowPreview={setShowPreview} />

      <div className="relative flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <ActivityBar
            showExplorer={showExplorer}
            setShowExplorer={setShowExplorer}
            showAiChat={showAiChat}
            setShowAiChat={setShowAiChat}
            showTerminal={showTerminal}
            setShowTerminal={setShowTerminal}
          />
        </div>
        <div
          className={`${
            mobilePanelOpen === "explorer" ? "flex" : "hidden"
          } w-full md:flex md:w-auto`}
        >
          <AnimatePresence initial={false}>
            {showExplorer && (
              <Explorer projectId={id} tree={tree} openFile={openFile} reloadTree={loadTree} />
            )}
          </AnimatePresence>
        </div>
        <div
          className={`${
            mobilePanelOpen === "editor" ? "flex" : "hidden"
          } relative min-w-0 flex-1 flex-col overflow-hidden border-x border-white/[0.06] md:flex`}
        >
          {loading && (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              Loading project...
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="absolute right-2 top-2 z-40 flex items-center gap-2 sm:right-4 sm:top-3">
                {showPreview && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleFullscreen}
                    title={
                      isPreviewFull ? "Exit Fullscreen" : "Fullscreen Preview"
                    }
                    className="flex items-center justify-center rounded-lg border border-white/10 bg-[#111113]/95 p-2 text-zinc-400 shadow-lg backdrop-blur hover:text-white"
                  >
                    {isPreviewFull ? (
                      <Minimize size={14} />
                    ) : (
                      <Maximize size={14} />
                    )}
                  </motion.button>
                )}

                <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-[#111113]/95 p-1 shadow-lg backdrop-blur">
                  {/* Editor Button */}
                  <button
                    type="button"
                    onClick={handleEditor}
                    className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      !showPreview
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Code2 size={13} className="relative"/>
                    <span className="relative hidden sm:inline">Editor</span>
                  </button>

                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={handlePreview}
                    className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      showPreview
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Eye size={13} className="relative" />
                    <span className="relative hidden sm:inline">Preview</span>
                  </button>
                </div>
              </div>
              <div
                className={`flex-1 min-h-0 overflow-hidden ${
                  isPreviewFull ? "fixed inset-0 z-50 bg-[#0a0a0c]" : ""
                }`}
              >
                <div className="flex min-h-0 flex-1 overflow-hidden">
                {showPreview ? (
                    <Preview tree={tree}/>   
                ) : (
                  <Editor />
                )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
