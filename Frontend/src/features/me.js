import {api} from "../utils/axios";
export const me=async()=>{
    try{
        const {data}=await api.get("/api/me");
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;    
    }
}