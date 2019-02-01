const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Bc = require('../blockchain');
const {INITIAL_BALANCE} = require('../config')
describe('Wallet', ()=>{
    let wallet, tp,bc;

    beforeEach(()=>{
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Bc();
    })

    describe('creating a transcation', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'random321';
            transaction = wallet.createTransaction(recipient, sendAmount, tp, bc);

        });

        describe('and doing the same transactiion', () =>{
            beforeEach(()=>{
                wallet.createTransaction(recipient, sendAmount, tp, bc);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance', ()=>{
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance-sendAmount * 2)
            });

            it('clones the `sendAmoount` output for the recipient', ()=> {
                expect(transaction.outputs.filter(output => output.address === recipient)
                .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });

    describe('calculating the balance', () =>{
        let addBalance,repeatAdd, senderWallet;
        beforeEach(()=>{
            addBalance = 100;
            repeatAdd = 3;
            senderWallet = new Wallet();
            for(let i =0;i<3;i++){
                senderWallet.createTransaction(wallet.publicKey, addBalance, tp, bc);
            }
            bc.addBlock(tp.transactions)
        });
        it('calculates the balance for the blockchain transactions matching the recipiemny', ()=>{
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
        });
        it('calculates the balance for the blockchain transactions matching the sender', ()=>{
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });    
        describe('and the recipient conducts a transaction',()=>{
            let subtractAmount, recipientBalance;
            beforeEach(()=>{
                tp.clear();
                subtractAmount = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, subtractAmount, tp, bc);
                bc.addBlock(tp.transactions);
            });

            describe(' and the sender sends another transaction to the recipient', ()=>{
                beforeEach(()=>{
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, tp, bc);
                    bc.addBlock(tp.transactions);
                });
                it('calculates the recipient balance but only using transactions since its most recent one',() =>{
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractAmount + addBalance);
                });
            });
        });

    });
});