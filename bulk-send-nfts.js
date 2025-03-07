const Web3 = require('web3').Web3;
const fs = require('fs/promises');
const web3 = new Web3('https://rpc.blast.io');
const contractABI = require('./contract-interaction/WOB-NFT-ABI.json');

const privateKey = '0x'+'';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);


const contractAddress = '0xc0E32BB6df4e581AEe1FAd639AD9695CFc8745Cb';
const nftContract = new web3.eth.Contract(contractABI, contractAddress);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getNFTs(address) {
  try {
    const batchSize = 10;
    const allTokens = await nftContract.methods.tokensOfOwner(address).call();
    const totalTokens = allTokens.length;
    for (let i = 0; i < totalTokens; i += batchSize) {
      const batch = allTokens.slice(i, i + batchSize);
      for (const tokenId of batch) {
        console.log(`Token ID: ${tokenId}`);
        try {
          const itemDetails = await nftContract.methods.getItemDetails(tokenId).call();
          console.log(`Item details, Token ID ${tokenId}:`, itemDetails);
        } catch (error) {
          console.error(`Error with Token ID ${tokenId}:`, error);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

  } catch (error) {
    console.error('Erro ao obter NFTs:', error);
  }
}

async function approveToken(contractAddress, tokenId) {
  try {
    const tx = await nftContract.methods.approve(contractAddress, tokenId);
    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    const receipt = await tx.send({ from: account.address, gas, gasPrice });
    console.log(`Token ID ${tokenId} approved for contract ${contractAddress}. Tx Hash: ${receipt.transactionHash}`);
  } catch (error) {
    console.error(`Error approving token ID ${tokenId}:`, error);
  }
}

async function transferNFT(toAddress, tokenId) {
  console.log({ toAddress, tokenId })
  try {

    //await approveToken(contractAddress, tokenId);

    const tx = nftContract.methods.transferFrom(web3.eth.accounts.wallet[0].address , toAddress, tokenId);
    console.log('tx: ', tx);

    // const isApproved = await nftContract.methods.getApproved(tokenId).call();
    // if (isApproved.toLowerCase() === contractAddress.toLowerCase()) {
    //   console.log(`Contract ${contractAddress} is approved to transfer token ID ${tokenId}`);
    // } else {
    //   console.error(`Contract ${contractAddress} is NOT approved to transfer token ID ${tokenId}`);
    // }

    const gas = await tx.estimateGas({ from: web3.eth.accounts.wallet[0].address });
    console.log('gas: ', gas);
        
    const gasPrice = await web3.eth.getGasPrice();
    console.log('gasPrice: ', gasPrice);

    const txReceipt = await tx.send({ from: web3.eth.accounts.wallet[0].address , gas, gasPrice });
    console.log('txReceipt: ', txReceipt);

    console.log('Transaction Hash hash:', txReceipt.transactionHash);
  } catch (error) {
    console.error('Error with transfering NFTs:', error);
    if (error.data) {
      try {
        const revertReason = web3.eth.abi.decodeParameter('string', error.data.substring(10));
        console.error('Revert Reason:', revertReason);
      } catch (decodeError) {
        console.error('Failed to decode revert reason:', decodeError);
      }
    }

    throw error
  }
}



const readFile = async (filePath, encoding = 'utf8') => {
  try {
    const data = await fs.readFile(filePath, encoding);
    return data;
  } catch (err) {
    console.error('Error reading the file:', err);
    throw err;
  }
};

const writeFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing the file:', err);
    throw err;
  }
};

const processFiles = async () => {
  try {
    const addressesData = await readFile('address_1.txt');
    const addresses = addressesData.split('\n').filter(line => line.trim() !== '');
    const tokenData = await readFile('items1.json');
    const tokenJson = JSON.parse(tokenData);
    const tokenIds = tokenJson.items.map(item => item.tokenId);
    if (addresses.length > tokenIds.length) {
      return;
    }

    const jsonData = addresses.map((address, index) => ({
      status: 'pending',
      address: address,
      tokenId: tokenIds[index]
    }));


    fs.writeFile('addresses_with_tokens.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('ERRO:', err);
      } else {
        console.log('save.');
      }
    });

  } catch (error) {
    console.error('erro', error);
  }
};



const checkDuplicates = async () => {
  try {
    const data = await readFile('addresses_with_tokens.json');
    const addressesData = JSON.parse(data);
    console.log({ addressesData })

    const addressesSet = new Set();
    const duplicates = []
    addressesData.forEach(item => {
      if (addressesSet.has(item.address)) {
        duplicates.push(item.address);
      } else {
        addressesSet.add(item.address);
      }
    });

    if (duplicates.length > 0) {
      console.log('Duplicates:', duplicates);
    } else {
      console.log('No Duplicates.');
    }

  } catch (error) {
    console.error('Error in JSON:', error);
  }
};

const sendNFT = async () => {
  console.log("START");
  const data = await readFile('bulk-send-nfts-data.json');
  const addressesData = JSON.parse(data);
  //console.log(addressesData)
  for (const item of addressesData) {
    if (item.status === 'pending') {
      await transferNFT(item.address, item.tokenId);
      item.status = 'done';
      await writeFile('bulk-send-nfts-data.json', addressesData);
      await delay(1250);
    }
  }

  console.log("DONE");
}

sendNFT();
// Get all contract NFTs of a wallet.
// const ownerAddress = '0x21d9f2609f5De61fD352E2Aa4bBd202D08E694dF'; // Replace with a valid address
// nftContract.methods.tokensOfOwner(ownerAddress).call()
//   .then(console.log)
//   .catch(console.error);