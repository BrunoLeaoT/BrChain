const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS? process.env.PEERS.split(',') : [];

class P2pServer{
    constructor(blockchain, transactionPool){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        
        this.sockets = [];
    }

    listen(){
        const server = new WebSocket.Server({port: P2P_PORT});
        server.on('connection', socket => this.connectionSocket(socket));
        
        this.connectToPeers();
        console.log(`Listening for perr-to-peer connections on: ${P2P_PORT}`);

    }

    connectToPeers(){
        peers.forEach(peer => {
            const socket = new WebSocket(peer);

            socket.on('open', () => this.connectionSocket(socket));
            
        });
    }
    connectionSocket(socket){
        this.sockets.push(socket);
        console.log('Socket Connected');
        this.messageHandler(socket);    
        this.sendChain(socket);
    }

    messageHandler(socket){
        socket.on('message', message =>{
            const data = JSON.parse(message);
            console.log(this.transactionPool)
            if(data.transaction){
                console.log("opa")
                this.transactionPool.updateOrAddTransaction(data.transaction)
            }
            else{
                this.blockchain.replaceChain(data);   
            }
        })
    }

    sendChain(socket){
        socket.send(JSON.stringify(this.blockchain.chain));
    }
    sendTransaction(socket, transaction){
        socket.send(JSON.stringify({transaction}))
    }
    syncChains(){
        this.sockets.forEach(socket => this.sendChain({socket}))
    }

    broadcastTransaction(transacation){
        this.sockets.forEach( socket => this.sendTransaction(socket, transacation));
    }    
}

module.exports = P2pServer;