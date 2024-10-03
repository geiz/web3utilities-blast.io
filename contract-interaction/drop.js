const Web3 = require('web3').Web3;
const fs = require('fs/promises');
const web3 = new Web3('https://rpc.blast.io');
const contractABI = require('./WOB-DROP-ABI.json');

const privateKey = '0x' + '';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const contractAddress = '0xe498a3967Cd73153890095A6Be3F6853421342B6';
const nftContract = new web3.eth.Contract(contractABI, contractAddress);

const updateMultipliersPosition = async (position, value) => {
  try {
    const tx = nftContract.methods.updateMultipliersPosition(position, value);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const updateWeightsPosition = async (position, value) => {
  try {
    const tx = nftContract.methods.updateWeightsPosition(position, value);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const updateRate = async (rate) => {
  try {
    const tx = nftContract.methods.updateRate(rate);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const withdrawBalanceWETH = async () => {
  try {
    const tx = nftContract.methods.withdrawBalance("0x4300000000000000000000000000000000000004", 100000000000000);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}


//updateRate(5373747290915);
 //updateWeightsPosition(1, 1500);

 const main = async () => {

  // await updateRate(58299845094);
// await updateWeightsPosition(1, 1260);
// await updateWeightsPosition(2, 2100);
// await updateWeightsPosition(3, 2940);
// await updateWeightsPosition(4, 2940);
// await updateWeightsPosition(5, 2100);
// await updateWeightsPosition(6, 2100);
// await updateWeightsPosition(7, 5460);
// await updateWeightsPosition(8, 2100);
// await updateWeightsPosition(9, 2100);
// await updateWeightsPosition(10, 7392);
// await updateWeightsPosition(11, 1260);
// await updateWeightsPosition(12, 7392);
// await updateWeightsPosition(13, 1461);
// await updateWeightsPosition(14, 2100);
// await updateWeightsPosition(15, 1050);
// await updateWeightsPosition(16, 840);
// await updateWeightsPosition(17, 336);
// await updateWeightsPosition(18, 336);
// await updateWeightsPosition(19, 168);
// await updateWeightsPosition(20, 252);
// await updateWeightsPosition(21, 168);
// await updateWeightsPosition(22, 168);
// await updateWeightsPosition(23, 168);
// await updateWeightsPosition(24, 84);
// await updateWeightsPosition(25, 60);


// await updateMultipliersPosition(1, 64);
// await updateMultipliersPosition(2, 67);
// await updateMultipliersPosition(3, 70);
// await updateMultipliersPosition(4, 72);
// await updateMultipliersPosition(5, 76);
// await updateMultipliersPosition(6, 78);
// await updateMultipliersPosition(7, 80);
// await updateMultipliersPosition(8, 82);
// await updateMultipliersPosition(9, 85);
// await updateMultipliersPosition(10, 90);
// await updateMultipliersPosition(11, 92);
// await updateMultipliersPosition(12, 98);
// await updateMultipliersPosition(13, 110);
// await updateMultipliersPosition(14, 120);
// await updateMultipliersPosition(15, 140);
// await updateMultipliersPosition(16, 160);
// await updateMultipliersPosition(17, 170);
// await updateMultipliersPosition(18, 190);
// await updateMultipliersPosition(19, 210);
// await updateMultipliersPosition(20, 280);
// await updateMultipliersPosition(21, 350);
// await updateMultipliersPosition(22, 450);
// await updateMultipliersPosition(23, 600);
// await updateMultipliersPosition(24, 800);
// await updateMultipliersPosition(25, 1000);


 }

main();
