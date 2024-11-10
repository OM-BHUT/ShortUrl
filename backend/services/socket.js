require('dotenv').config({path: '../.env'});

const {Server} = require('socket.io');

let io;

function initSocket(server){
    io = new Server(server,{
        cors:{
            origin:[process.env.COR_URL1,process.env.COR_URL2],
            credentials: true
        }
    });
    io.on('connection',(socket)=>{
        console.log(`user connected ${socket.id}`);
    })

    return io;
}


function getIo(){
    if (!io){
        throw new Error('socket io not initialized');
    }
    return io;
}


module.exports = {
    initSocket,
    getIo
}