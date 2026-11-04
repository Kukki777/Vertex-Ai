import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { login } from "../features/login";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, setUserData } from "../redux/userSlice";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Folder, Hand, Loader2, Plus } from "lucide-react";
import {
  getProjects,
  getStarredProjects,
} from "../features/project";
import { setProjects } from "../redux/projectSlice";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModel from "../components/CreateProjectModel";

function Dashboard() {
  const [loading, setLoading] = React.useState(false);
  const [signInError, setSignInError] = React.useState("");
  const [activeSession, setActiveSession] = React.useState("projects");
  const [loadingProjects, setLoadingProjects] = React.useState(false);
  const [openModel, setOpenModel] = React.useState(false);

  const dispatch = useDispatch();

  const userData = useSelector(selectUserData);
  const projects = useSelector((state) =>
    Array.isArray(state.project?.projects) ? state.project.projects : []
  );

  const handleGoogleSignIn = async () => {
    try {
      setSignInError("");
      setLoading(true);

      const data = await signInWithPopup(auth, googleProvider);
      const token = await data.user.getIdToken();

      const newdata = await login(token);

      dispatch(setUserData(newdata));

      console.log("Login successful:", newdata);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      const code = error?.code;
      if (code === "auth/unauthorized-domain") {
        setSignInError("This app domain is not authorized for Google sign-in in Firebase.");
      } else if (error?.response) {
        const message = error.response.data?.message;
        setSignInError(
          message
            ? `The backend rejected sign-in: ${message}`
            : `The backend returned HTTP ${error.response.status} during sign-in.`,
        );
      } else if (code?.startsWith("auth/")) {
        setSignInError(error.message || "Google sign-in failed. Please try again.");
      } else {
        setSignInError(
          "Could not connect to the backend. Check the VITE_SERVER_URL deployment setting.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    try {
      setLoadingProjects(true);

      const data = await getProjects();

      dispatch(setProjects(data));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchStarredProjects = async () => {
    try {
      setLoadingProjects(true);

      const data = await getStarredProjects();

      // Starred projects also go into the same Redux state
      dispatch(setProjects(data));
    } catch (error) {
      console.error("Error fetching starred projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };
  useEffect(() => {
    if (activeSession === "projects") {
      fetchAllProjects();
    } else {
      fetchStarredProjects();
    }
  }, [activeSession]);

  const refreshProjects = async () => {
  if (activeSession === "projects") {
    await fetchAllProjects();
  } else {
    await fetchStarredProjects();
  }
};

  if (!userData) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 transition-colors duration-300 dark:bg-[#07070c]">
        <div className="pointer-events-none absolute left-1/2 top-32 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.15] opacity-50 blur-[120px] dark:block" />

        <div className="relative w-full max-w-sm rounded-2xl border border-slate-200/70 bg-white/80 p-8 text-center shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-black/40">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg shadow-black/5 dark:border-transparent">
            <span className="text-lg font-bold text-slate-900">AI</span>
          </div>

          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
            Welcome to Vertex AI
          </h2>

          <p className="mb-6 text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400">
            Sign in to access your projects and continue building
          </p>

          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white py-2.5 text-[13.5px] font-medium text-slate-800 shadow-sm shadow-blue-500/20 transition-colors duration-150 hover:bg-slate-50 disabled:opacity-70 dark:border-transparent dark:bg-white dark:hover:bg-slate-100"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <FcGoogle />

            {loading ? "Loading..." : "Continue with Google"}
          </button>

          {signInError && (
            <p className="mt-4 text-left text-xs leading-relaxed text-red-600 dark:text-red-400" role="alert">
              {signInError}
            </p>
          )}

          <p className="mt-5 text-[11px] text-slate-500 dark:text-slate-600">
            By continuing you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-[#07070c]">
      <div className="pointer-events-none absolute left-1/3 top-40 hidden h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.15] opacity-50 blur-[140px] dark:block" />

      <div className="pointer-events-none absolute right-0 top-1/3 hidden h-[500px] w-[500px] rounded-full bg-white/[0.15] opacity-50 blur-[130px] dark:block" />

      <div className="relative flex min-h-0 flex-1 flex-col">
        <Navbar />

        <div className="flex min-h-0 flex-1">
          <Sidebar
            activeSession={activeSession}
            setActiveSession={setActiveSession}
          />

          <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8 [scrollbar-width:thin] [scrollbar-color:rgba(100,116,139,0.35)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20">

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-[26px] font-bold text-slate-900 dark:text-white">
                  Welcome Back,{" "}
                  {userData?.data?.name?.split(" ")[0] || "User"}

                  <span>
                    <Hand />
                  </span>
                </h1>

                <p className="mt-1 text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Ready to build something amazing today?
                </p>
              </div>

              <button className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-opacity duration-150 hover:opacity-90 dark:bg-white dark:text-slate-900"
              onClick={()=>setOpenModel(true)}>
                <Plus size={16} />
                New Project
              </button>
            </div>

            {/* Section heading */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                {activeSession === "starred"
                  ? "Starred Projects"
                  : "Recent Projects"}
              </h2>
            </div>

            {/* Projects */}
            {loadingProjects ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2
                  size={20}
                  className="animate-spin text-slate-400 dark:text-slate-500"
                />
              </div>
            ) : projects.length === 0 ? (
              /* Empty state */
              <div className="mb-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/40 py-16 text-center dark:border-white/[0.1] dark:bg-white/[0.01]">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900/5 dark:bg-white/10">
                  <Folder
                    size={24}
                    className="text-slate-500 dark:text-white"
                  />
                </div>

                <h3 className="mb-1.5 text-[16px] font-semibold text-slate-900 dark:text-white">
                  {activeSession === "starred"
                    ? "No starred projects"
                    : "No Projects yet"}
                </h3>

                <p className="mt-5 max-w-xs text-[13px] text-slate-500 dark:text-slate-500">
                  {activeSession === "starred"
                    ? "Star a project to see it here"
                    : "Create your first project and start building something amazing!"}
                </p>
              </div>
            ) : (
              /* Project cards */
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project._id || index}
                    project={project}
                    onDelete={refreshProjects}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {openModel && <CreateProjectModel
      open={openModel}
      onClose={() => setOpenModel(false)}
       />}
    </div>
  );
}

export default Dashboard;
