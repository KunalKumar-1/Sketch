import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({port: 8080});

wss.on('connection', function connection(ws, request){

  const url = request.url; //ws:localhost:8080?token=123saed3w
  if(!url){
    return;
  } 

  const queryParams =  new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get("name") || ""; //falls back to empty string

  const decoded = jwt.verify(token, JWT_SECRET);

  if(typeof decoded === "string"){
    ws.close();
    return;
  }

  if(!decoded || !(decoded.userId)){
    ws.close();
    return;
} //if user is not authorized, close the connection

  ws.on('message', function message(msg){
  ws.send('pong');
 
 });

});