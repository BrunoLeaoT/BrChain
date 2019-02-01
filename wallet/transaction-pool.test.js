const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const {MINING_REWARD} = require('../config');
const Blockchain = require('../blockchain')
describe('TransactionPool', () => {

    let tp, wallet, transaction,bc;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        bc = new Blockchain();
        transaction = wallet.createTransaction('r4nd-4dr355', 30, tp, bc);
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

    it('testing clear transaction pool',()=>{
        tp.clear();
        expect(tp.transactions).toEqual([]);
    }); 

    describe(' mixing valid and corrupt transaction', ()=>{
        let validTransactions;

        beforeEach(()=>{
            validTransactions = [...tp.transactions];
            for( let i=0;i<6;i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('fodass', 30, tp, bc);
                if(i%2==0){
                     transaction.input.amount =9999;
                }else{
                    validTransactions.push(transaction);
                }
            }
        });

        it('shows a different between valid and corrupt transaction', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs a  valid transaction', () => {
            expect(tp.validTransactions()).toEqual(validTransactions);
        });
    });

    describe('creating a reward transaction',()=>{
        beforeEach(()=>{
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        });
        it(`rewards the miner's wallet`,()=>{
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(MINING_REWARD);
        });
    });
});