import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { state } from './model/state.js';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Server is Working' });
});

const server = http.createServer(app);



const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    //ws.send(`Welcome: ${message}`);
    const data = JSON.parse(message);

    try {
      const data = JSON.parse(message);

      if (data.message=="fetch") {
        ws.send(
          JSON.stringify(state[0])
        );
      }else if (data.message=="update"){
        state[0]= {
          state: data.name,
          state: data.state
        };
        wss.clients.forEach((client) =>{
        client.send(JSON.stringify(data))
      })
      }else{
        ws.send(JSON.stringify({
          message:"Unknown Command",
        }));
      }


    } catch (error){
      console.log(error.message);
        ws.send(
          JSON.stringify({
            message: error.message,
          })
        )  
    }
  });

});

server.listen(443, () => {
  console.log('Server is running on port 443');
});