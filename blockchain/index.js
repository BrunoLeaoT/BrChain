const Block = require('./block');

class Blockchain {
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length-1], data);
        this.chain.push(block);

        return block;
    }

    isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;
        for(let i =1; i<chain.length; i++){
            const block = chain[i];
            const lastBLock = chain[i-1];
            
            if(block.lastHash !== lastBLock.hash || block.hash !== Block.blockHash(block))
                return false;
        }

        return true
    }

    replaceChain(newChain){
        if(newChain.length <= this.chain.length){
            console.log('Chain is not longet than the current chain');
            return;
        }
        else if( !this.isValidChain(newChain)){
            console.log('Chain is not valid.');
            return;
        }
        console.log('Replacing blockchain chain.');
        this.chain = newChain;
    }
}

module.exports = Blockchain;