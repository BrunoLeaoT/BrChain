const ChainUtil = require('../chain-util');

class Transaction{
    constructor(){
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    static newTrasaction(senderWallet, recipient, amount){
        const transaction = new this();
        if(senderWallet.balance < amount){

            console.log("Errouuu");
            return;
    
        }
        transaction.outputs.push(...[{
            amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            {amount, address: recipient}
        ])

        return transaction;
    }
}

module.exports = Transaction;