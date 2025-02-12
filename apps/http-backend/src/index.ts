import express  from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
 app.use(express.json());


 app.post('/signup', async (req, res) => {
 // db call
 // to check if the data user sending is correct or not 

 const parseData = CreateUserSchema.safeParse(req.body);
 if(!parseData.success){
    res.json({
        message: "Incorrect inputs"
    })
    return;
 }
    try{
      const user =  await prismaClient.user.create({
            data: {
                email: parseData.data?.username,
                //hash the password later
                password: parseData.data.password,
                name: parseData.data.name
            }
        })
     res.json({
        userId: user.id,
        message: "User Created !"
     })
    } catch(e){
        res.status(411).json({
            message: "This username already exists"
        })
    }
})


app.post('/signin', async (req, res) =>{
    //to check if the data user sending is correct or not
    const parseData = SigninSchema.safeParse(req.body);
    if(!parseData.success){
        console.log(parseData.error);
       res.json({
           message: "Incorrect inputs"
       })
       return; 
    }

    //TODO: compare the password with the hashed password in the db
    
    const user = await prismaClient.user.findFirst({
        where: {
            email: parseData.data.username,
            password: parseData.data.password
        }
    })
    
    if(!user) {
        res.status(401).json({
            message: "Invalid credebntials"
        })
        return;
    }
   
   //generate a token && send it back to the user
   const token =  jwt.sign({
       userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})


app.post('/room', middleware, async(req, res) => {
    

    const parseData = CreateRoomSchema.safeParse(req.body);

    if(!parseData.success){
       res.json({
           message: "Incorrect inputs"
       })
       return; 
    }
// db call here to check if the data user sending is correct or not
 //@ts-ignore
    const userId = req.userId;
    await prismaClient.room.create({
        data: {
            slug: parseData.data.name,
            adminId: userId
        }
    })

    res.json({
        roomId: 123
    })
})

app.listen(3001);
