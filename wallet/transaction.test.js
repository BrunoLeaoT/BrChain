const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTrasaction( wallet, recipient, amount);
    })

    it('output the `amount` subtracted from the waller balance', ()=> {
        expect(transaction.outputs.find(output => output.address == wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it('output the `amount` added to the recipient the wallet balance', ()=> {
        expect(transaction.outputs.find(output => output.address == recipient).amount).toEqual(amount);
    });

    describe('Transaction with an amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 50000;
            transaction = Transaction.newTrasaction( wallet, recipient, amount);
        });
        it('doens not create the transaction', ()=> {
            expect(transaction).toEqual(undefined);
        });
    
        
    });
});
