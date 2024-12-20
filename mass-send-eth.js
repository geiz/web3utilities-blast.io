const Web3 = require('web3').Web3;
const fs = require('fs/promises');
const web3 = new Web3('https://rpc.blast.io');

const privateKey = '0x'+''; // Replace with your private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// List of recipients and amounts
const recipients = [
  
{address:"0x53feba757be2be0f440cb6b5017314e89eb13bc2",amount:"0.000618"},
{address:"0x0f0b3d8fc9bbd9231972c91717c4b54d39d0ce29",amount:"0.000412"},
{address:"0x8cf6b98f59487ed43f64c7a94516dca2f010acc8",amount:"0.000412"},
{address:"0x452c23d49343abf8524609f70226e9d0eeecb33f",amount:"0.000412"},
{address:"0xa73d12034f8d4ac890d3a446b482dd0fb56f7717",amount:"0.000412"},
{address:"0xa78c8901622c2476fd06d40f90db5973508beffc",amount:"0.000412"},
{address:"0xacbc9bf12851fc342edc84647580a18b469f90d3",amount:"0.000412"},
{address:"0xd4e3473b279661767ffdf3ac4113e2979dd5d075",amount:"0.000412"},
{address:"0xd7f6cf729d38a4fb7bb3ea0a7e833bd06d4a7581",amount:"0.000412"},
{address:"0xe05e33fd09da0b23ed4d8ded64d3f702a1f196fb",amount:"0.000206"},
{address:"0xe40e17d79c51da492e2f521edbb6e37ce2c8b86c",amount:"0.000412"},
{address:"0x869b678387bb473721ce2ee4ad46af37e754bbd9",amount:"0.000206"},
{address:"0x8fe121d7c4a3f7cfacd527a6efd9d106e06825bd",amount:"0.000206"},
{address:"0x91669a1bdb132c8103774a58410cf6934714dea4",amount:"0.000206"},
{address:"0x940dea37db7055480236c3ff7b01353820397a70",amount:"0.000206"},
{address:"0x945ae4fb999baf5c3c8988941a1ca16ed68d31ef",amount:"0.000206"},
{address:"0x98b833c4ec4464ee4c8ca452cadaa1159f60f2f0",amount:"0.000206"},
{address:"0x90ab1584829a534b13e1de6106fb86ffa4d697bc",amount:"0.000206"},
{address:"0x1bbe4b495a79ceacc0285598bdbb346ae296ccd2",amount:"0.000206"},
{address:"0x261fb7c6df525f557aeb2dd3336510fc29c39441",amount:"0.000206"},
{address:"0x4afa6906103b6724334576ffc3c128a2d6cbfc2f",amount:"0.000206"},
{address:"0x4f8382f3d38108128e98b621f7370179dd99e1b6",amount:"0.000206"},
{address:"0xb2043d1a61ca800e90529ad68ad16f4aab6141b0",amount:"0.000206"},
{address:"0xbd4f96516844f8bd9d9fe875eb6ce27969b55272",amount:"0.000206"},
{address:"0x60d7bf75d84d4322e7f73daf019e54be73db8d4c",amount:"0.000206"},
{address:"0xc667891581280551ad01a0feece6b925d9c9bb08",amount:"0.000206"},
{address:"0xcf921619da0f5b3ae0a40e286b85b4a530e4e654",amount:"0.000206"},
{address:"0x78aaacd130134a15a42a3791043f0040c733389b",amount:"0.000206"},
{address:"0x79ed589a7b0a50f3c36572034a1904fa3156a46f",amount:"0.000206"},
{address:"0x7e0bed47bf81ae705a1b6e787bcd87a9ffd14435",amount:"0.000206"},
{address:"0xe4219e2c3cc4e27ac541846fe53a064eaf149e67",amount:"0.000206"},
{address:"0xe53007b2c5bbc02389ae9b55802eaf8a0789f461",amount:"0.000206"},
{address:"0xeccc3c80e9d8a3037bb1b5958869cea5e1adc7a1",amount:"0.000206"},
{address:"0xecf3166c40317d399d20238d0833d5f745caecca",amount:"0.000206"},
{address:"0xf6b52e84e9685582b29d28a437660e905b0e132d",amount:"0.000206"},
{address:"0xfdca236a8b2f5ab68b8771204a11778ae8c67d3f",amount:"0.000206"},
    
];

// Function to send ETH to a recipient
const sendETH = async (recipient) => {
  try {
    const tx = {
      from: web3.eth.accounts.wallet[0].address,
      to: recipient.address,
      value: web3.utils.toWei(recipient.amount, 'ether'),
      gas: 21000, // Standard gas limit for ETH transfer
    };

    const gasPrice = await web3.eth.getGasPrice();
    tx.gasPrice = gasPrice;

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Transaction successful! Hash: ${receipt.transactionHash}`);
  } catch (err) {
    console.error(`Failed to send ETH to ${recipient.address}:`, err);
  }
};

// Main function to iterate through the recipients
const main = async () => {
  console.log('Starting mass ETH transfer...');
  for (const recipient of recipients) {
    console.log(`Sending ${recipient.amount} ETH to ${recipient.address}...`);
    await sendETH(recipient);
  }
  console.log('Mass transfer completed.');
};

main().catch((err) => {
  console.error('Error during execution:', err);
});
