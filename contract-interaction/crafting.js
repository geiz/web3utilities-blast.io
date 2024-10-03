const Web3 = require('web3').Web3;
const fs = require('fs/promises');
const web3 = new Web3('https://rpc.blast.io');
const contractABI = require('./WOB-CRAFTING-ABI.json');

const privateKey = '0x'+'';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const contractAddress = '0x72FcADD39E147749098c4c1edcd3823EaC56a097';
const craftingContract = new web3.eth.Contract(contractABI, contractAddress);

const addCreator = async (walletAddress) => {
  try {
    const tx = craftingContract.methods.addCreator(walletAddress);
    const gas = await tx.estimateGas({ from: walletAddress });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: walletAddress, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}

const removeCreator = async (walletAddress) => {
  try {
    const tx = craftingContract.methods.removeCreator(walletAddress);
    const gas = await tx.estimateGas({ from: walletAddress });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: walletAddress, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error: ', error);
    throw err;
  }
}

const transferOwnership = async (walletAddress) => {
  try {
    const tx = craftingContract.methods.transferOwnership(walletAddress);
    const gas = await tx.estimateGas({ from: walletAddress });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: walletAddress, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error: ', error);
    throw err;
  }
}

//addCreator('0xd44F4D8ffe293BBBEb0e8194A73ea0547431D4D7');
//removeCreator('0x886b3a0b2F4486B7048E0F57909FCc668f9A6958');
//transferOwnership('0xd44F4D8ffe293BBBEb0e8194A73ea0547431D4D7');