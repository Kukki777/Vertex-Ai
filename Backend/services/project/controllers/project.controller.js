import { redis } from "../../../gateway/shared/redis/redis.js";
import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
    try{
        // console.log("PROJECT HEADERS:", req.headers);
        // console.log("PROJECT BODY:", req.body);
        const userId=req.headers['x-user-id'];
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID not found in request headers",
            });
        }
        const{name,description}=req.body;
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Name and description are required",
            });
        }
        const project=await Project.create({
            owner:userId,
            name,
            description,
        });
        const key=`projects-${userId}`;
        await redis.del(key); // Invalidate cache for this user
        return res.status(201).json({
            success: true,
            data: project
        });

    }catch(error){
        console.error("Error creating project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export const getProjects = async (req, res) => {
    try{
        const userId=req.headers['x-user-id'];
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID not found in request headers",
            });
        }
        const key=`projects-${userId}`;
        let result=await redis.get(key);
        if(result){
             return res.status(200).json({
            success: true,
            projects:JSON.parse(result)
        });
        }
        
        const projects=await Project.find({owner:userId}).sort({updatedAt:-1});
        await redis.set(key,JSON.stringify(projects));
        return res.status(200).json({
            success: true,
            projects
        });

    }catch(error){
        console.error("Error fetching projects:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export const getProjectById = async (req, res) => {
    try{
         const {id} =req.params;
        const project=await Project.findById(id)
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        project.lastOpenAt = new Date();
        await project.save();
        return res.status(200).json({
            success: true,
            project
        });
    }catch(error){
        console.error("Error fetching project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


export const getStarredProjects = async (req, res) => {
    try{
        const userId=req.headers['x-user-id'];
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID not found in request headers",
            });
        }   
        const key=`starred-projects-${userId}`; 
        let result=await redis.get(key);
        if(result){
             return res.status(200).json({
            success: true,
            projects:JSON.parse(result)
        });
        }
        const projects=await Project.find({owner:userId,starred:true}).sort({updatedAt:-1});
        await redis.set(key,JSON.stringify(projects));
        return res.status(200).json({
            success: true,
            projects
        });

    }catch(error){
        console.error("Error fetching starred projects:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


export const toggleStar = async (req, res) => {

    try{
        const userId=req.headers['x-user-id'];
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID not found in request headers",
            });
        }
        const {id} =req.params;
        const project=await Project.findById(id)
        
        if (!project) { 
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        project.starred=!project.starred;
        await project.save();
        const key=`starred-projects-${userId}`;
        await redis.del(key) // Invalidate starred projects cache for this user
        await redis.del(`projects-${userId}`)
        return res.status(200).json({
            success: true,
            project
        });
    }catch(error){
        console.error("Error toggling star on project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}  

export const deleteProject = async (req, res) => {
    try{
        console.log("PROJECT HEADERS:", req.headers);

        const userId=req.headers['x-user-id'];
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID not found in request headers",
            });
        }
       
        const {id} =req.params;
        const project=await Project.findByIdAndDelete(id)
        
        if (!project) { 
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        const key=`projects-${userId}`;
        await redis.del(key) // Invalidate projects cache for this user
        const starredKey=`starred-projects-${userId}`;
        await redis.del(starredKey) // Invalidate starred projects cache for this user
        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            project
        });
    }catch(error){
        console.error("Error deleting project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}





