const Web3 = require('web3').Web3;
const fs = require('fs/promises');
const web3 = new Web3('https://rpc.blast.io');
const contractABI = require('./WOB-NFT-ABI.json');

const privateKey = '0x' + '';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const contractAddress = '0xc0E32BB6df4e581AEe1FAd639AD9695CFc8745Cb';
const nftContract = new web3.eth.Contract(contractABI, contractAddress);

const addCreator = async (walletAddress) => {
  try {
    const tx = nftContract.methods.addCreator(walletAddress);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}

const removeCreator = async (walletAddress) => {
  try {
    const tx = nftContract.methods.removeCreator(walletAddress);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}

const updateCraftingContractAddress = async (contractAddress) => {
  try {
    const tx = nftContract.methods.updateCraftingContractAddress(contractAddress);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}

const mint = async (craftableItemId, quantity) => {
  try {
    const tx = nftContract.methods.mint(craftableItemId, quantity);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    throw error;
  }
}

const addToWhitelist = async (contractAddress) => {
  try {
    const tx = nftContract.methods.addToWhitelist(contractAddress);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}

const removeFromWhiteList = async (contractAddress) => {
  try {
    const tx = nftContract.methods.removeFromWhiteList(contractAddress);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}
removeFromWhiteList("0xfE538b5cA1E2c3252e88DDD29ee892448957411b")
// addToWhitelist("0xfE538b5cA1E2c3252e88DDD29ee892448957411b");
