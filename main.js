const SHA256 = require('crypto-js/sha256')
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block{
    constructor(timestamp,transactions,previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data)+ this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash);
    }
}


class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    createGenesisBlock(){
        return new Block("01/01/2017","Genesis","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }
    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty)
    //     this.chain.push(newBlock);
    // }
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log('block successfully mined');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null,miningRewardAddress,this.miningReward)
        ];
    }
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    isChainValid(){
        for(let i = 1;i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let xCoin = new Blockchain();
xCoin.createTransaction(new Transaction('address1','address2',100));
xCoin.createTransaction(new Transaction('address2','address1',50));
console.log('Starting miner... \n');
xCoin.minePendingTransactions('x-address');
console.log('\n Balance of x is', xCoin.getBalanceOfAddress('x-address'));

console.log('Starting miner again... \n');
xCoin.minePendingTransactions('x-address');
console.log('\n Balance of x is', xCoin.getBalanceOfAddress('x-address'));
// console.log('Block 1 ...')
// xCoin.addBlock(new Block(1,"17/10/2018",{amount: 4}));
// console.log('Block 2 ...')
// xCoin.addBlock(new Block(2,"17/10/2018",{amount: 5}));

// console.log('is blockchain valid? '+ xCoin.isChainValid());

// xCoin.chain[1].data = {amount: 100};
// xCoin.chain[1].hash = xCoin.chain[1].calculateHash();
// console.log('is blockchain valid? '+ xCoin.isChainValid());
// console.log(JSON.stringify(xCoin,null,4));