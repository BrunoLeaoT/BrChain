const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
class Miner{
    constructor(blockchain, transactionPool, wallet, p2pServer){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine(){
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
        // create a block consisting of the valid transactions
        const block = this.blockchain.addBlock(validTransactions);
        // syncronize the chain in  the p2p server
        this.p2pServer.syncChains();
        // clear the transactionPool
        this.transactionPool.clear();
        // broadcast to the rest of the miners
        this.p2pServer.broadcastClearTransaction();

        return block;
    }
}

module.exports = Miner;