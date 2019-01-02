const Block = require('./block');
const {DIFFICULTY, mine_rate} = require('../config')
describe('Block',() => {
    let data, lastBlock, block;
    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });

    it('sets the `last` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates  a hash that macthes the deifficulty', () =>{
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });
    it('lower the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+36000)).toEqual(block.difficulty -1);  
    });
    it('up the difficulty for quickly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty +1);  
    });
});