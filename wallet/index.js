const { INITIAL_BALANCE} = require('../config')
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');

class Wallet {
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet -
        publicKey: ${this.publicKey.toString()}
        balance: ${this.balance}`
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }


    createTransaction(recipient, amount, transactionPool, blockchain){
        this.balance = this.calculateBalance(blockchain);
        if(this.balance < amount){
            console.log(`Amount: ${amount} exceeds the current balanca: ${this.balance}`);
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publicKey);
        if(transaction){
           transaction.update(this, recipient, amount);
        }
        else{
           transaction = Transaction.newTrasaction(this, recipient, amount);
           transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];
        blockchain.chain.forEach(block => block.data.forEach(transaction=> {
            transactions.push(transaction)
        }));
        const walletInputT = transactions.filter(transaction => transaction.input.address === this.publicKey);
        
        let startTime = 0;
        if(walletInputT.length >0){      
            let lastTransaction = walletInputT.reduce(
                (prev, curr) => prev.input.timestamp > curr.input.timestamp ? prev : curr
            );

            balance = lastTransaction.outputs.find(output => output.address === this.publicKey).amount
            
            startTime = lastTransaction.input.timestamp;         
        }
        transactions.forEach(transaction =>{
            if(transaction.input.timestamp > startTime){
                transaction.outputs.find(output => {
                    if(output.address === this.publicKey){
                        balance += output.amount;
                    }
                });
            }
        });
        return balance;
    }
    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;