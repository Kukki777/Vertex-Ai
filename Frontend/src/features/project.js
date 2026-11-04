import {api} from "../utils/axios";

export const createProject=async(name,description)=>{
    try{
        const {data}=await api.post("/api/project",{name,description});
        return data;
    } catch (error) {
        console.error("Create project error:", error);
        throw error;    
    }
}

export const getProjects=async()=>{
    try{
        const {data}=await api.get("/api/project");
        return data.projects;
    } catch (error) {
        console.error("Get projects error:", error);
        throw error;    
    }
}

export const getProjectById=async(id)=>{
    try{
        const {data}=await api.get(`/api/project/${id}`);
        return data;
    } catch (error) {
        console.error("Get project by ID error:", error);
        throw error;    
    }
}

export const getStarredProjects=async()=>{
    try{
        const {data}=await api.get("/api/project/starred");
        return data.projects;
    } catch (error) {
        console.error("Get starred projects error:", error);
        throw error;    
    }
}

export const toggleStar=async(id)=>{
    try{
        const {data}=await api.patch(`/api/project/${id}`);
        return data;
    } catch (error) {
        console.error("Toggle star error:", error);
        throw error;    
    }
}

export const deleteProject=async(id)=>{
    try{
        const {data}=await api.delete(`/api/project/${id}`);
        return data;
    } catch (error) {
        console.error("Delete project error:", error);
        throw error;    
    }
}