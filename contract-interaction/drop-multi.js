const Web3 = require('web3').Web3;
const fs = require('fs/promises');
const web3 = new Web3('https://rpc.blast.io');
const contractABI = require('./WOB-DROP-MULTI-ABI.json');

const privateKey = '0x' + '';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const contractAddress = '0xcF6dF93ac5e3b4daA110031791898dc1ec2A3017';
const dropContract = new web3.eth.Contract(contractABI, contractAddress);

const authorizeContract = async (add, bool) => {
  try {
    const tx = dropContract.methods.authorizeContract(add, bool);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const withdrawBalance = async (addr, amount) => {
  try {
    const tx = dropContract.methods.withdrawBalance(addr, amount);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const claimMaxGas = async () => {
  try {
    const tx = dropContract.methods.claimMaxGas("0x28920CC7abcaFB8798246D6a408bc8384b9A9c1f");
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const claimAllYield = async () => {
  try {
    const tx = dropContract.methods.claimAllYield("0x28920CC7abcaFB8798246D6a408bc8384b9A9c1f");
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

async function addNewToken(name, addr, totalWeight, rate, weights, multipliers) {
  try {
    // Ensure weights and multipliers are arrays of length 12
    if (weights.length !== 12 || multipliers.length !== 12) {
      throw new Error("Weights and multipliers must have exactly 12 elements.");
    }

    // Call the `addNewToken` function
    const tx = await dropContract.methods.addNewToken(name, addr, totalWeight, rate, weights, multipliers);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const updateTokenRate = async (index, rate) => {
  try {
    const tx = dropContract.methods.updateTokenRate(index, rate);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}

const tokenData1 = {
  name: "ETH",
  addr: "0x4300000000000000000000000000000000000004", // Replace with the token's address
  totalWeight: 46335,
  rate: 40888530214, //50888530214
  weights: [10940, 11250, 12000, 6995, 800, 750, 500, 1100, 545, 555, 400, 500],
  multipliers: [75, 80, 85, 90, 105, 135, 175, 225, 275, 325, 400, 500]
};

const tokenData = {
  name: "IRON",
  addr: "0xEa7c7d702291EB14289875b8a30E809f3F3f5993", // Replace with the token's address
  totalWeight: 46335,
  rate: 20355412085462,
  weights: [10940, 11250, 12000, 6995, 800, 750, 500, 1100, 545, 555, 400, 500],
  multipliers: [50, 50, 50, 100, 125, 150, 0, 0, 0, 0, 0, 250]
};


const setNftDamageThreshold = async (damageThreshold) => {
  try {
    const tx = dropContract.methods.setNftDamageThreshold(damageThreshold);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (err) {
    throw err;
  }
}


/**
 * Creates a new NFT by interacting with the addNewNFT function in the contract.
 *
 * @param {string} name - Name of the NFT contract.
 * @param {string} address - Address of the NFT contract.
 * @param {string} prob - Probability (e.g., "1000000000000000000" for 1.0).
 * @param {Array} ids - Array of NFT IDs that can be looted.
 */
async function createNewNFT(name, address, prob, ids) {
  try {
    // Ensure weights and multipliers are arrays of length 12
    
    if (ids.length !== 30) {
      throw new Error("ids must have exactly 30 elements.");
    }

    // Call the `addNewNFT` function
    const tx = await dropContract.methods.addNewNFT(name, address, prob, ids);
    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address, gas, gasPrice });
    console.log('Transaction, hash:', txReceipt.transactionHash);
  } catch (error) {
    console.error('Error Adding new NFT:', error);
    throw error;
  }
}


const nftData = {
  name: "WOB Weapon NFT",
  addr: "0xc0E32BB6df4e581AEe1FAd639AD9695CFc8745Cb", // Replace with the token's address
  prob: 2000000000000000000, // 2%
  ids: [4098, 4099, 4121, 4124, 4125, 4126, 4129, 4450, 4451, 4452, 4453, 4454, 4455, 4456, 4457, 4458, 4459, 4462, 4464, 4465, 4466, 4467, 4468, 4469, 4470, 4471, 4472, 4473, 4474, 4475],
};



const main = async () => {
  // await addNewToken(tokenData.name, tokenData.addr, tokenData.totalWeight, tokenData.rate, tokenData.weights, tokenData.multipliers)
  //
  //await updateTokenRate(0, 50363906191);
  await createNewNFT(nftData.name, nftData.addr, nftData.prob, nftData.ids);
  //await setNftDamageThreshold(92000);
  //await withdrawBalance("0xAaDFcb4d7AE00617E8C93Df88164247453Bb601a", 10000000000000000000000000)

  // await withdrawBalance("0x4300000000000000000000000000000000000004", 60000000000000000)
  // await claimAllYield();
  //await authorizeContract("0x701D49f48606467DF03A6Ef823E5E056074Ed7C9", true);
  // await withdrawBalanceWETH(200000000000000000);
  // await withdrawBalanceWETH(60000000000000000);

  //  await configureAutomaticYieldOnBehalf();

  // await updateRate(49413154236);


}

main();
