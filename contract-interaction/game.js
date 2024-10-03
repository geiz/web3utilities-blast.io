const Web3 = require('web3').Web3;
const fs = require('fs/promises');
const web3 = new Web3('https://rpc.blast.io');
const contractABI = require('./WOB-GAME-ABI.json');

const privateKey = '0x' + '';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const contractAddress = '0xe5aF04103111519C65dD6f54c677c0724F5c9C51';
const nftContract = new web3.eth.Contract(contractABI, contractAddress);

const transferOwnership = async (walletAddress) => {
  try {
    const tx = nftContract.methods.transferOwnership(walletAddress);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error: ', error);
    throw err;
  }
}

transferOwnership('0xd44F4D8ffe293BBBEb0e8194A73ea0547431D4D7');