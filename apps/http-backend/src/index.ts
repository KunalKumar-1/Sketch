import express  from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema } from "@repo/common/types"

const app = express();


app.post('/signup', (req, res) => {
 // db call

 res.json({
    userId,
    message: "User created"
 })

})


app.post('signin', (req, res) =>{
    
    const userId = 1;
   const token =  jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})



app.post('rooms', middleware, (req, res) => {
    // db call here

    res.json({
        roomId: 123
    })
})


app.listen(3001);