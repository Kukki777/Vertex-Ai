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
import { Bot, Code2, Eye, Files, Maximize, Minimize, SquareTerminal } from "lucide-react";
import Preview from "../components/Preview";
import Editor from "../components/Editor";
import BottomPanel from "../components/BottomPanel";
import AiChat from "../components/AiChat";

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
  const [showBottomPanel, setShowBottomPanel] = useState(false);

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
      console.log("UPDATED TREE FROM BACKEND:", data.data);
      setTree([...data.data]);
      return data.data;
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
  const openFile = (file) => {
    setOpenTabs((prev) => {
      const existingTab = prev.find((tab) => tab._id === file._id);
      if (existingTab) {
        setActiveTab(existingTab);
        return prev;
      }
      setActiveTab(file);
      return [...prev, file];
    });
    setShowPreview(false);
  };
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
      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-[140px]" />
      <Topbar showPreview={showPreview} setShowPreview={setShowPreview} />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden shrink-0 md:block">
          <ActivityBar
            showExplorer={showExplorer}
            setShowExplorer={setShowExplorer}
            showAiChat={showAiChat}
            setShowAiChat={setShowAiChat}
            showTerminal={showBottomPanel}
            setShowTerminal={setShowBottomPanel}
          />
        </div>
        <div
          className={`${
            mobilePanelOpen === "explorer" ? "flex" : "hidden"
          } min-h-0 shrink-0 md:flex`}
        >
          <AnimatePresence initial={false}>
            {showExplorer && (
              <Explorer
                projectId={id}
                tree={tree}
                openFile={openFile}
                reloadTree={loadTree}
              />
            )}
          </AnimatePresence>
        </div>
        <div
          className={`${
            mobilePanelOpen === "editor" ? "flex" : "hidden"
          } relative min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-x border-white/[0.06] md:flex`}
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
                  <button
                    type="button"
                    onClick={handleEditor}
                    className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      !showPreview
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Code2 size={13} />
                    <span className="hidden sm:inline">Editor</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePreview}
                    className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      showPreview
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Eye size={13} />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                </div>
              </div>
              <div
                className={`relative flex min-h-0 flex-1 flex-col overflow-hidden ${
                  isPreviewFull ? "fixed inset-0 z-50 bg-[#0a0a0c]" : ""
                }`}
              >
                <div className="flex min-h-0 flex-1 overflow-hidden">
                  {showPreview ? (
                    <Preview tree={tree} />
                  ) : (
                    <Editor
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      openTabs={openTabs}
                      setOpenTabs={setOpenTabs}
                      reloadTree={loadTree}
                    />
                  )}
                </div>
              </div>
            </>
          )}
          <AnimatePresence>
            {showPreview && isPreviewFull && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="fixed inset-0 z-[100] bg-white"
              >
                <Preview tree={tree} />
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleFullscreen}
                  className="absolute right-2 top-2 z-[110] flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#111113]/95 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 shadow-lg shadow-black/40 backdrop-blur hover:text-white sm:right-4 sm:top-3 sm:px-3 sm:text-xs"
                >
                  <Minimize size={14} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showBottomPanel && (
              <div className="max-h-[45vh] md:max-h-none">
                <BottomPanel
                  projectId={id}
                  onClose={() => setShowBottomPanel(false)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={`${mobilePanelOpen == "chat" ? "flex" : "hidden"} w-fu;; md:flex md:w-auto`}
        >
          <AnimatePresence initial={false}>
            {showAiChat && <AiChat projectId={id} />}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center justify-around border-t border-white/[0.06] py-2 bg-[#ofof12] md:hidden ">
        <button
          onClick={() => {
            setMobilePanelOpen("explorer");
            setShowExplorer(true);
          }}
          className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${mobilePanelOpen === "explorer" ? "text-white" : "text-zinc-500"}`}
        >
          <Files size={18} />
          Files
        </button>
        <button
          className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${mobilePanelOpen === "editor" ? "text-white" : "text-zinc-500"}`}
          onClick={() => {
            setMobilePanelOpen("editor");
          }}
        >
          <Code2 size={18} />
          Editor
        </button>

        <button
          className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${mobilePanelOpen === "chat" ? "text-white" : "text-zinc-500"}`}
          onClick={() => {
            setMobilePanelOpen("chat");
            setShowAiChat(true);
          }}
        >
          <Bot size={18} />
          Chat
        </button>
        <button 
          className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${showBottomPanel ? "text-white" : "text-zinc-500"}`}
          onClick={() => {
            setShowBottomPanel(val => !val);
          }}
        >
          <SquareTerminal size={18} />
          Terminal
        </button>
      </div>
    </div>
  );
}

export default ProjectPage;
