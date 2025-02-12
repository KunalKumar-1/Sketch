import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8080});

wss.on('connection', function connection(ws){
    ws.on('error', function error(err){
        console.error(err);
    });
    
    ws.on('message', function message(msg){
        ws.send('pong');
    });

});