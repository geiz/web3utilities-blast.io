const Web3 = require('web3').Web3;
const fs = require('fs/promises');
const web3 = new Web3('https://rpc.blast.io');
const contractABI = require('./WOB-NFT-ABI.json');

const privateKey = '';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);



const contractAddress = '0xFB7acDaE5B59e9C3337203830aEC1563316679E6';
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
          console.log(`Detalhes do Item para Token ID ${tokenId}:`, itemDetails);
        } catch (error) {
          console.error(`Erro ao obter detalhes para Token ID ${tokenId}:`, error);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

  } catch (error) {
    console.error('Erro ao obter NFTs:', error);
  }
}



async function transferNFT(toAddress, tokenId) {
  console.log({ toAddress, tokenId })
  try {
    const tx = nftContract.methods.safeTransferFrom(account.address, toAddress, tokenId);
    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    const txReceipt = await tx.send({ from: account.address, gas, gasPrice });
    console.log('Transação enviada, hash:', txReceipt.transactionHash);
    console.log('Transação confirmada!');
  } catch (error) {
    console.error('Erro ao transferir NFT:', error);
    throw err;
  }
}



const readFile = async (filePath, encoding = 'utf8') => {
  try {
    const data = await fs.readFile(filePath, encoding);
    return data;
  } catch (err) {
    console.error('Erro ao ler o arquivo:', err);
    throw err;
  }
};

const writeFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Erro ao salvar o arquivo:', err);
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
      console.log('Endereços duplicados encontrados:', duplicates);
    } else {
      console.log('Nenhum endereço duplicado encontrado.');
    }

  } catch (error) {
    console.error('Erro ao processar o arquivo JSON:', error);
  }
};

const sendNFT = async () => {
  console.log("START");
  const data = await readFile('addresses_with_tokens.json');
  const addressesData = JSON.parse(data);
  console.log(addressesData)
  for (const item of addressesData) {
    if (item.status === 'pending') {
      console.log({ address: item.address });
      await transferNFT(item.address, item.tokenId);
      item.status = 'done';
      await writeFile('addresses_with_tokens.json', addressesData);
      await delay(1000);
    }
  }

  console.log("DONE");
}

sendNFT();