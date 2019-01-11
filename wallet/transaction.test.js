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


    it('inputs the balance of the waller', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () =>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a corrupt transaction', () =>{
        transaction.outputs[0].amount = 200000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
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

    describe(`and updating a transaction`, () => {
        let nextAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'n3xt';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('subtracts the next amount from the senders outputs', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
        });
    });
});
