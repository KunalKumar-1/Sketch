import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({port: 8080});

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];
  
 function checkUser(token: string): string | null { //if user is not authorized, close the connection
  try {
      const decoded = jwt.verify(token, JWT_SECRET);

        if(typeof decoded === "string") {
          return null;
        }

        if(!decoded || !(decoded.userId)){
          return null;
        }
        return decoded.userId;
      } catch(e) {
        return null;
    }
    return null;
 }

wss.on('connection', async function connection(ws, request){

    const url = request.url; //ws:localhost:8080?token=123saed3w 
    if(!url){
      return;
    } 

    const queryParams =  new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get("token") || ""; //falls back to empty string
    const userId = checkUser(token);

    if(userId === null) {
      ws.close();
      return null;
    }
    
    users.push({
      userId,
      rooms: [], //rooms that the user is in
      ws
    })

  ws.on('message', async function message(data){
    try{
      const parseData = JSON.parse(data.toString());  //{type: "join_room", roomId: "21"}

      //joins the room
      if(parseData.type === "join_room") {
        const user = users.find(x => x.ws === ws);
        user?.rooms.push(parseData.roomId);
      }

      // leaves the room 
      if(parseData.type === "leave_room") {    //{type: "leave_room", roomId: "21"}
        const user = users.find(x => x.ws === ws);//find the user
        if(!user) {
          return; 
        }
        user.rooms = user?.rooms.filter(x => x !== parseData.roomId);//remove the room from the user
      }

      // chats in the room
      if(parseData.type === "chat") { //{type: "chat", roomId: "21", message: "Hello"}
        const roomId = parseData.roomId;
        const message = parseData.message;
// stores in the db 
        await prismaClient.chat.create({
          data: {
            roomId,
            message,
            userId
          }
        })
        users.forEach(user => {
          if(user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
              type: "chat",
              message,
              roomId
            }))
          }
        })
      }
    } catch(e) {
    console.error("Invalid message format:", e);
    ws.send(JSON.stringify({ e: "Invalid JSON format" }));
    }
 });

  ws.on('error', (err) => {
    console.error('WebSocket Error:', err);
  });

});