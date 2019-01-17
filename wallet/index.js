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


    createTransaction(recipient, amount, transactionPool){
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
}

module.exports = Wallet;