const express = require('express');
const bodyParser = require('body-parser')
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain);
const wallet = new Wallet();
const tp = new TransactionPool();
app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain, tp);
});

app.post('/mine', (req,res) => {
    const block = blockchain.addBlock(req.body.data);
    console.log(`New Block added: ${block.toString()}`);
    
    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => console.log(`Listening in port ${HTTP_PORT}`));
p2pServer.listen();