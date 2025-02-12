import express  from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";

const app = express();


app.post('/signup', (req, res) => {
 // db call
 // to check if the data user sending is correct or not 

 const data = CreateUserSchema.safeParse(req.body);

 if(!data.success){
    res.json({
        message: "Incorrect inputs"
    })
    return;
 }

 res.json({
    userId: 123,
    message: "User created"
 })

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