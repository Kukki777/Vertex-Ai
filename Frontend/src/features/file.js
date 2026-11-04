import {api} from "../utils/axios";

export const createRootFolder=async({projectId,projectName})=>{
    try{
        const {data}=await api.post("/api/file/create-root-folder",{projectId,projectName});
        return data;
    } catch (error) {
        console.error("Features Root folder error:", error);
        throw error;    
    }
}

export const createFolder=async({projectId,name,parentId})=>{
    try{
        const {data}=await api.post("/api/file/create-folder",{projectId,name,parentId});
        return data;
    } catch (error) {
        console.error("Features create folder error:", error);
        throw error;    
    }
}

export const createFile=async({projectId,name,parentId,content='',language='plaintext'})=>{
    try{
        const {data}=await api.post("/api/file/create-file",{projectId,name,parentId,content,language});
        return data;
    } catch (error) {
        console.error("Features create file error:", error);
        throw error;    
    }
}


export const updateFile=async({name,content,id})=>{
    try{
        const {data}=await api.post(`/api/file/update/${id}`,{name,content});
        return data;
    } catch (error) {
        console.error("Toggle star error:", error);
        throw error;    
    }
}

export const deleteFile=async(id)=>{
    try{
        const {data}=await api.delete(`/api/file/${id}`);
        return data;
    } catch (error) {
        console.error("features Delete file error:", error);
        throw error;    
    }
}

export const getFile=async(id)=>{
    try{
        const {data}=await api.get(`/api/file/${id}`);
        return data;
    } catch (error) {
        console.error("features Get file error:", error);
        throw error;    
    }
}

export const getTree=async(projectId)=>{
    try{
        const {data}=await api.get(`/api/file/tree/${projectId}`);
        return data;
    } catch (error) {
        console.error("features Get tree error:", error);
        throw error;    
    }
}