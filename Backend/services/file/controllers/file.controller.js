import File from "../models/file.model.js";
import { buildTree } from "../utils/buildTree.js";

export const createRootFolder=async(req,res)=>{
    try{
        const{projectId,projectName}=req.body;
        const userId=req.headers['x-user-id'];

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User ID is required",
            });
        }

        if(!projectId || !projectName){
            return res.status(400).json({
                success:false,
                message:"Project ID and project name are required",
            });
        }

        const existingRootFolder=await File.findOne({
            projectId,
            parentId:null,
            isDeleted:false,
        });

        if(existingRootFolder){
            return res.status(400).json({
                success:false,
                message:"Root folder already exists for this project",
            });
        }

        const rootFolder=await File.create({
            owner:userId,
            projectId,
            name:projectName,
            type:"folder",
            parentId:null
        });

        return res.status(201).json({
            success:true,
            data:rootFolder
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Create Root Folder Error: ${error.message}`,
        });
    }
}

export const createFolder=async(req,res)=>{
    try{
        const{projectId,name,parentId}=req.body;
        const userId=req.headers['x-user-id'];

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User ID is required",
            });
        }

        if(!projectId || !name || !parentId){
            return res.status(400).json({
                success:false,
                message:"Project ID, name and parentId are required",
            });
        }

        const existingFolder=await File.findOne({
            name,
            projectId,
            parentId,
            isDeleted:false,
        });

        if(existingFolder){
            return res.status(400).json({
                success:false,
                message:"Folder already exists in this location",
            });
        }

        const folder=await File.create({
            owner:userId,
            projectId,
            name,
            type:"folder",
            parentId,
        });

        return res.status(201).json({
            success:true,
            data:folder
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Create Folder Error: ${error.message}`,
        });
    }
}

export const createFile=async(req,res)=>{
    try{
        const{projectId,name,parentId,content='',language='plaintext'}=req.body;
        const userId=req.headers['x-user-id'];

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User ID is required",
            });
        }

        if(!projectId || !name || !parentId){
            return res.status(400).json({
                success:false,
                message:"Project ID, name and parentId are required",
            });
        }

        const existing=await File.findOne({
            name,
            projectId,
            parentId,
            isDeleted:false,
        });

        if(existing){
            return res.status(400).json({
                success:false,
                message:"File already exists in this location",
            });
        }

        const extension=name.includes(".")?name.split(".").pop():"";

        const file=await File.create({
            owner:userId,
            projectId,
            name,
            type:"file",
            content,
            language,
            extension,
            size:content.length,
            parentId,
        });

        return res.status(201).json({
            success:true,
            data:file
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Create File Error: ${error.message}`,
        });
    }
}

export const updateFile=async(req,res)=>{
    try{
        const{name,content}=req.body;
        const userId=req.headers['x-user-id'];

        const file=await File.findOne({
            _id:req.params.id,
            owner:userId,
            isDeleted:false
        });

        if(!file){
            return res.status(404).json({
                success:false,
                message:"File not found",
            });
        }

        if(name){
            file.name=name;
            file.extension=name.includes(".")?name.split(".").pop():"";
        }

        if(content!==undefined){
            file.content=content;
            file.size=content.length;
        }

        await file.save();

        return res.status(200).json({
            success:true,
            data:file
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Update File Error: ${error.message}`,
        });
    }
}

export const deleteFile=async(req,res)=>{
    try{
        const userId=req.headers['x-user-id'];

        const file=await File.findOneAndUpdate(
            {
                _id:req.params.id,
                owner:userId,
                isDeleted:false
            },
            {
                isDeleted:true
            },
            {
                new:true
            }
        );

        if(!file){
            return res.status(404).json({
                success:false,
                message:"File not found",
            });
        }

        return res.status(200).json({
            success:true,
            data:file
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Delete File Error: ${error.message}`,
        });
    }
}
export const getFile=async(req,res)=>{
    try{
        const userId=req.headers['x-user-id'];

        const file=await File.findOne({
            _id:req.params.id,
            owner:userId,
            isDeleted:false
        });

        if(!file){
            return res.status(404).json({
                success:false,
                message:"File not found",
            });
        }

        return res.status(200).json({
            success:true,
            data:file
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:`Get File Error: ${error.message}`,
        });
    }
}

export const getTree = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { projectId } = req.params;

    const files = await File.find({
      projectId,
      owner: userId,
      isDeleted: false
    }).sort({ name: 1, type: -1 });

    const tree = buildTree(files);

    return res.status(200).json({
      success: true,
      data: tree
    });

  } catch (error) {
    console.error("GET TREE BACKEND ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


