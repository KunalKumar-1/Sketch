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


app.post('signin', (req, res) =>{
    //to check if the data user sending is correct or not
    const data = SigninSchema.safeParse(req.body);
    if(!data.success){
       res.json({
           message: "Incorrect inputs"
       })
       return; 
    }

    const userId = 1;
   const token =  jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})



app.post('rooms', middleware, (req, res) => {
    // db call here to check if the data user sending is correct or not
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
       res.json({
           message: "Incorrect inputs"
       })
       return; 
    }

    res.json({
        roomId: 123
    })
})


app.listen(3001);
