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

const authorizeContract = async (add, bool) => {
  try {
    const tx = nftContract.methods.authorizeContract(add, bool);
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

const withdrawBalanceWETH = async (amount) => {
  try {
    const tx = nftContract.methods.withdrawBalance("0x4300000000000000000000000000000000000004", amount);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const claimMaxGas = async () => {
  try {
    const tx = nftContract.methods.claimMaxGas("0x28920CC7abcaFB8798246D6a408bc8384b9A9c1f");
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const claimAllYield = async () => {
  try {
    const tx = nftContract.methods.claimAllYield("0x28920CC7abcaFB8798246D6a408bc8384b9A9c1f");
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}


const configureAutomaticYieldOnBehalf = async () => {
  try {
    const tx = nftContract.methods.configureAutomaticYieldOnBehalf();
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
  //await authorizeContract("0x701D49f48606467DF03A6Ef823E5E056074Ed7C9", true);
 // await withdrawBalanceWETH(200000000000000000);
  // await withdrawBalanceWETH(60000000000000000);

//  await configureAutomaticYieldOnBehalf();

   await updateRate(49413154236);


//  await updateWeightsPosition(0, 0);
// await updateWeightsPosition(1, 500);
// await updateWeightsPosition(2, 1000);
// await updateWeightsPosition(3, 500);
// await updateWeightsPosition(4, 500);
// await updateWeightsPosition(5, 2500);
// await updateWeightsPosition(6, 2000);
// await updateWeightsPosition(7, 1500);
// await updateWeightsPosition(8, 3000);
// await updateWeightsPosition(9, 2800);
// await updateWeightsPosition(10, 12000);
// await updateWeightsPosition(11, 20035);
// await updateWeightsPosition(12, 0);
// await updateWeightsPosition(13, 0);
// await updateWeightsPosition(14, 0);
// await updateWeightsPosition(15, 0);
// await updateWeightsPosition(16, 0);
// await updateWeightsPosition(17, 0);
// await updateWeightsPosition(18, 0);
// await updateWeightsPosition(19, 0);
// await updateWeightsPosition(20, 0);
// await updateWeightsPosition(21, 0);
// await updateWeightsPosition(22, 0);
// await updateWeightsPosition(23, 0);
// await updateWeightsPosition(24, 0);
// await updateWeightsPosition(25, 0);

// // Updating multipliers based on the provided rate values
// await updateMultipliersPosition(0, 100);
// await updateMultipliersPosition(1, 100);
// await updateMultipliersPosition(2, 100);
// await updateMultipliersPosition(3, 82);
// await updateMultipliersPosition(4, 85);
// await updateMultipliersPosition(5, 88);
// await updateMultipliersPosition(6, 90);
// await updateMultipliersPosition(7, 92);
// await updateMultipliersPosition(8, 95);
// await updateMultipliersPosition(9, 99);
// await updateMultipliersPosition(10, 100);
// await updateMultipliersPosition(11, 101);
// await updateMultipliersPosition(12, 0);
// await updateMultipliersPosition(13, 0);
// await updateMultipliersPosition(14, 0);
// await updateMultipliersPosition(15, 0);
// await updateMultipliersPosition(16, 0);
// await updateMultipliersPosition(17, 0);
// await updateMultipliersPosition(18, 0);
// await updateMultipliersPosition(19, 0);
// await updateMultipliersPosition(20, 0);
// await updateMultipliersPosition(21, 0);
// await updateMultipliersPosition(22, 0);
// await updateMultipliersPosition(23, 0);
// await updateMultipliersPosition(24, 0);
// await updateMultipliersPosition(25, 0);
 }

main();
