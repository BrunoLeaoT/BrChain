const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {

    let tp, wallet, transaction;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTrasaction(wallet, 'r4nd-4dr355', 30)
        tp.updateOrAddTransaction(transaction);
    });

    it('Transaction added to the transaction pool', ()=>{
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('Transaction updates transaction in the transaction pool', ()=>{
        const oldTranscation = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'Okeu dokey', 40)
        tp.updateOrAddTransaction(newTransaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTranscation);
    });
});