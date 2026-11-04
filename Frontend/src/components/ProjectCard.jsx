import React from "react";
import { motion } from "motion/react";
import { Star, Trash2 } from "lucide-react";
import { deleteProject, toggleStar } from "../features/project";
import { useDispatch } from "react-redux";
import { setCurrentProject, starProject } from "../redux/projectSlice";
import { useNavigate } from "react-router-dom";

function ProjectCard({ project, onDelete }) {
  const [loading, setLoading] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleToggleStar = async () => {
    setLoading(true);
    await toggleStar(project?._id);
    dispatch(starProject(project?._id));
    setLoading(false);
  };
  const handleDelete = async () => {
    setLoading(true);
    await deleteProject(project?._id);
    setConfirmDelete(false);
    await onDelete();
    setLoading(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -3,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => {
        navigate(`/project/${project._id}`);
      }}
      className="group relative cursor-pointer rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duation-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:border-white/[0.07] dark:bg-white/[0.05] dark:shadow-none dark:hover:border-white/[0.14] dark:hover:bg-white/[0.045]"
    >
      <motion.div
        whileTap={{
          scale: 0.9,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleToggleStar();
        }}
        disabled={loading}
        className={`absolute right-4 top-4 z-10 rounded-md p-1 transition-opacity hover:text-amber-400 ${project.starred ? "opacity-100 text-amber-400" : "opacity-0 text-zinc-300 group-hover:opacity-100 dark:text-zinc-600"} ${loading ? "cursor-wait opacity-60" : ""}`}
      >
        <Star
          size={15}
          className={project.starred ? "fill-amber-400 text-amber-400" : ""}
        />
      </motion.div>
      <h3 className="mb-1.5 truncate pr-6 text-[14px] font-semibold tracking-tight text-zinc-900 dark:text-white">
        {project.name}
      </h3>
      <p className="line-clamp-2 min-h-[2.5em] text-[13px] leading-snug text-zinc-500 dark:text-zinc-400">
        {project.description || "No Description"}
      </p>

      <div className="mt-4 flex items-center justify-end border-t border-black/[0.05] pt-3 dark:border-white/[0.06]">
        {confirmDelete ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(false);
              }}
              className="rounded-md  px-2 py-1 text-[11px] font-medium text-zinc-400  hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="rounded-md bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-500 shadow-sm hover:bg-red-500/20 dark:text-red-400 disabled:cursor-wait disabled:opacity-50"
            >
              Yes
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(true);
            }}
            className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-zinc-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-zinc-600 dark:hover:text-red-400"
          >
            <Trash2 size={13} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ProjectCard;
