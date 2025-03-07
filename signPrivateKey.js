const Web3 = require('web3').Web3;
const web3 = new Web3('https://rpc.blast.io');

// Operator PK
const privateKey = '0x'+'';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// Function to sign a message and recover the signing address
async function signAndRecoverMessage(message) {
  try {
    // Sign the message using the account's private key
    const signature = await web3.eth.accounts.sign(message, privateKey);

    // Recover the signing address from the signature
    const signingAddress = web3.eth.accounts.recover(message, signature.signature);

    return { signature: signature.signature, signingAddress };
  } catch (error) {
    console.error("Error signing or recovering message:", error);
  }
}

// Example usage
signAndRecoverMessage("Authorize Blast Points Transfer: ").then(result => {
  if (result) {
    console.log("Signature:", result.signature);
    console.log("Address:", result.signingAddress);
  }
});


/*
WOB Points Only. 

curl --request POST \
  --url https://waitlist-api.prod.blast.io/v1/dapp-auth/challenge \
  --header 'Content-Type: application/json' \
  --data '{
    "contractAddress": "0xe498a3967Cd73153890095A6Be3F6853421342B6",
    "operatorAddress": "0x4225d96C1d59D935c2b004823C184C4D9caF159e"
}'


curl --request POST \
  --url https://waitlist-api.prod.blast.io/v1/dapp-auth/solve \
  --header 'Content-Type: application/json' \
  --data '{
"challengeData":"",
  "signature": ""}'

curl --request GET \
  --url https://waitlist-api.prod.blast.io/v1/contracts/0xe498a3967Cd73153890095A6Be3F6853421342B6/point-balances \
  --header 'Authorization: Bearer '


— Send Points — 

curl --request POST \
  --url https://waitlist-api.prod.blast.io/v1/contracts/0xe498a3967Cd73153890095A6Be3F6853421342B6/batches \
  --header 'Authorization: Bearer ' \
  --header 'Content-Type: application/json' \
  --data '{
    "pointType": "PHASE2_POINTS",
    "transfers": [
      {
        "toAddress": "0xe498a3967Cd73153890095A6Be3F6853421342B6",
        "points": "33492.746485302424"
      }
    ],
    "secondsToFinalize": 3600
}'


// GOLD 

curl --request POST \
  --url https://waitlist-api.prod.blast.io/v1/contracts/0xe498a3967Cd73153890095A6Be3F6853421342B6/batches \
  --header 'Authorization: Bearer ' \
  --header 'Content-Type: application/json' \
  --data '{
    "pointType": "PHASE2_GOLD",
    "transfers": [
   {"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7717","points":"2397.5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7718","points":"1815"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7719","points":"1217.5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7720","points":"1202.5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7721","points":"752.5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7722","points":"720"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7723","points":"502.5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7724","points":"367.5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7725","points":"297.5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7726","points":"250"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7727","points":"157.5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7728","points":"140"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7729","points":"85"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7730","points":"25"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7731","points":"15"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7732","points":"7.5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7733","points":"5"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7734","points":"2.5"}
      ],
    "secondsToFinalize": 3600
}'

- Get Batch

curl --request GET \
  --url https://waitlist-api.prod.blast.io/v1/contracts/0xe498a3967Cd73153890095A6Be3F6853421342B6/batches \
  --header 'Authorization: Bearer '



— ADD D APP 

curl --request POST \
  --url https://waitlist-api.prod.blast.io/v1/operators/0x4225d96C1d59D935c2b004823C184C4D9caF159e/dapp-info \
  --header 'Authorization: Bearer ' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "World of Blast",
  "category": "NFTs/Gaming",
  "twitter": "WorldofBlast",
  "imageUrl": "https://worldofblast.com/assets/img/logo-wob-w-only-hd-padded.png"
}'


——


curl --request POST \
  --url https://waitlist-api.prod.blast.io/v1/contracts/0x4225d96C1d59D935c2b004823C184C4D9caF159e/batches \
  --header 'Authorization: Bearer ' \
  --header 'Content-Type: application/json' \
  --data '{
    "pointType": "LIQUIDITY",
    "transfers": [
      {
        "toAddress": "0x39619Bb67904B9827E40ee94Af32f6F83A085379",
        "points": "10"
      }
    ],
    "secondsToFinalize": 3600
}'


—

  --header 'Authorization: Bearer '
{"success":true,"balancesByPointType":{"DEVELOPER":{"available":"0","pendingSent":"0","earnedCumulative":"0","receivedCumulative":"0","finalizedSentCumulative":"0"},"LIQUIDITY":{"available":"213720.811266408549","pendingSent":"0","earnedCumulative":"213653.229700734883","receivedCumulative":"77.581565673666","finalizedSentCumulative":"10","byAsset":{"ETH":{"earnedCumulative":"0","earnedCumulativeBlock":5263294},"WETH":{"earnedCumulative":"213653.229700734883","earnedCumulativeBlock":5263293},"USDB":{"earnedCumulative":"0","earnedCumulativeBlock":5263293}}}}}%         

*/