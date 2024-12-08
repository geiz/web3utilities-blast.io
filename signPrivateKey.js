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
signAndRecoverMessage("Authorize Blast Points Transfer: 7ccc4d3b2f4a6dd1ed201a6eac0107509b34c60f1df49782aa55ac9bbb182519").then(result => {
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
"challengeData":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250cmFjdEFkZHJlc3MiOiIweGU0OThhMzk2N2NkNzMxNTM4OTAwOTVhNmJlM2Y2ODUzNDIxMzQyYjYiLCJvcGVyYXRvckFkZHJlc3MiOiIweDQyMjVkOTZjMWQ1OWQ5MzVjMmIwMDQ4MjNjMTg0YzRkOWNhZjE1OWUiLCJleHBpcmVzQXQiOiIyMDI0LTEyLTAyVDE1OjI3OjQxLjYxMloiLCJub25jZSI6IjdjY2M0ZDNiMmY0YTZkZDFlZDIwMWE2ZWFjMDEwNzUwOWIzNGM2MGYxZGY0OTc4MmFhNTVhYzliYmIxODI1MTkiLCJpYXQiOjE3MzMxNTMyMDEsImV4cCI6MTczMzE1MzI2MX0.qPHDNLp4pTOg9P7PpQXxCh-6LOmQz2Rnx8gx3sAETc4",
  "signature": "0x73be9a77b69d1a4839477248c2421219ca7f04cd6f3bc08cfc0abb6baad928761ae08cccbd087076bcd3a5e5aa8faf8932b30b06d7129af345e2e409b6fe00ea1c"}'

curl --request GET \
  --url https://waitlist-api.prod.blast.io/v1/contracts/0xe498a3967Cd73153890095A6Be3F6853421342B6/point-balances \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiI0NjE0MjUxMC03YjcyLTQwMGUtOTg0NC05Njk3MDczOTgxYTkiLCJjb250cmFjdEFkZHJlc3MiOiIweGU0OThhMzk2N2NkNzMxNTM4OTAwOTVhNmJlM2Y2ODUzNDIxMzQyYjYiLCJvcGVyYXRvckFkZHJlc3MiOiIweDQyMjVkOTZjMWQ1OWQ5MzVjMmIwMDQ4MjNjMTg0YzRkOWNhZjE1OWUiLCJpYXQiOjE3MzMxNTMyMjgsImV4cCI6MTczMzE1NjgyOH0.pCMrwwdJUGOYVfScuYWeyrprMGQN00AgO8ZN1kZL4ho'


— Send Points — 

curl --request POST \
  --url https://waitlist-api.prod.blast.io/v1/contracts/0xe498a3967Cd73153890095A6Be3F6853421342B6/batches \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.w7yML4grPHkfdbku1FRfjP7OtnKrDeFjpqYJEXVtyEI' \
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
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiI0NjE0MjUxMC03YjcyLTQwMGUtOTg0NC05Njk3MDczOTgxYTkiLCJjb250cmFjdEFkZHJlc3MiOiIweGU0OThhMzk2N2NkNzMxNTM4OTAwOTVhNmJlM2Y2ODUzNDIxMzQyYjYiLCJvcGVyYXRvckFkZHJlc3MiOiIweDQyMjVkOTZjMWQ1OWQ5MzVjMmIwMDQ4MjNjMTg0YzRkOWNhZjE1OWUiLCJpYXQiOjE3MzMxNTMyMjgsImV4cCI6MTczMzE1NjgyOH0.pCMrwwdJUGOYVfScuYWeyrprMGQN00AgO8ZN1kZL4ho' \
  --header 'Content-Type: application/json' \
  --data '{
    "pointType": "PHASE2_GOLD",
    "transfers": [
   {"toAddress":"0x2c3474bfe64cd9748be69d24c30cc91639265e68","points":"2333.316995"},
{"toAddress":"0xa73d12034f8d4ac890d3a446b482dd0fb56f7717","points":"1247.452475"},
{"toAddress":"0xbd4f96516844f8bd9d9fe875eb6ce27969b55272","points":"680.1945581"},
{"toAddress":"0xacbc9bf12851fc342edc84647580a18b469f90d3","points":"946.309081"},
{"toAddress":"0x79ed589a7b0a50f3c36572034a1904fa3156a46f","points":"674.4003032"},
{"toAddress":"0x90ab1584829a534b13e1de6106fb86ffa4d697bc","points":"549.6815743"},
{"toAddress":"0x8cf6b98f59487ed43f64c7a94516dca2f010acc8","points":"297.3435499"},
{"toAddress":"0x39619bb67904b9827e40ee94af32f6f83a085379","points":"894.2438113"},
{"toAddress":"0xb2043d1a61ca800e90529ad68ad16f4aab6141b0","points":"302.4773164"},
{"toAddress":"0x209babcef9411c02a4bd6e44652ed39baa1e0633","points":"181.7292267"},
{"toAddress":"0x0f0b3d8fc9bbd9231972c91717c4b54d39d0ce29","points":"166.3801725"},
{"toAddress":"0xd4e3473b279661767ffdf3ac4113e2979dd5d075","points":"107.2115884"},
{"toAddress":"0x67a245b4c49bc3047f9d97e84da751ff7510a406","points":"194.6997799"},
{"toAddress":"0xfdca236a8b2f5ab68b8771204a11778ae8c67d3f","points":"7.142857143"},
{"toAddress":"0x1404dbb98ae8432db42e78282473645cff306433","points":"50.17918893"},
{"toAddress":"0x1bbe4b495a79ceacc0285598bdbb346ae296ccd2","points":"55.28949575"},
{"toAddress":"0x53feba757be2be0f440cb6b5017314e89eb13bc2","points":"45.66022836"},
{"toAddress":"0x1d0230a9d81cb29d3efa01523698d4833c2701c0","points":"38.29298963"},
{"toAddress":"0x73093efc286a056bb8b58cc2b2cad64f6c662af8","points":"28.70136395"},
{"toAddress":"0xf6b52e84e9685582b29d28a437660e905b0e132d","points":"75.63075403"},
{"toAddress":"0xe53007b2c5bbc02389ae9b55802eaf8a0789f461","points":"17.14285714"},
{"toAddress":"0x951d6779bb84ac96fca24c07ca0ffc32dc7accc0","points":"26.22067526"},
{"toAddress":"0x6b821bd540ef180ab6e8219af224f9ba52045471","points":"11.88619931"},
{"toAddress":"0xe4219e2c3cc4e27ac541846fe53a064eaf149e67","points":"21.85835541"},
{"toAddress":"0xa78c8901622c2476fd06d40f90db5973508beffc","points":"28.68137913"},
{"toAddress":"0x452c23d49343abf8524609f70226e9d0eeecb33f","points":"48.6233484"},
{"toAddress":"0xe0a47d23575bfaef7e2eccebd4919e5737ace2a2","points":"13.77239862"},
{"toAddress":"0x91669a1bdb132c8103774a58410cf6934714dea4","points":"19.97215611"},
{"toAddress":"0xe43afa6dcacc47188f3cfdbcb511cf22a25c3cea","points":"10.94309965"},
{"toAddress":"0x281f15b13efee4bd9e49a84b0ff3047100e67be1","points":"12.91446108"},
{"toAddress":"0x4afa6906103b6724334576ffc3c128a2d6cbfc2f","points":"10.74177335"},
{"toAddress":"0xb30e6f9effc123f656cf355032f4c48e7ee8c959","points":"10.94309965"},
{"toAddress":"0xd2366adad4c1bf82c9b6cdbae1dc6f8da6c33d97","points":"20.94309965"},
{"toAddress":"0xbe9efba022266acb5fae0bd75b9fb8500e198871","points":"10.94309965"},
{"toAddress":"0x6fd42fd9287430af0ea3adc4f4146c79a50e168d","points":"24.6782826"},
{"toAddress":"0xf8c43a73612fb6d796b5518317593822aa6ff660","points":"1.886199308"},
{"toAddress":"0xe40e17d79c51da492e2f521edbb6e37ce2c8b86c","points":"25.22881394"},
{"toAddress":"0xa89c876be69223295a0925d7a62cb6868dec4ac8","points":"35.71428571"},
{"toAddress":"0xbde77033a21fe143c54f7fef6b9b84f44fbbf223","points":"35.71428571"},
{"toAddress":"0xc646ca5b3e116e2de08e39a4bd0e22ff01a371d8","points":"35.71428571"},
{"toAddress":"0xd7f6cf729d38a4fb7bb3ea0a7e833bd06d4a7581","points":"14.28571429"},
{"toAddress":"0x8fe121d7c4a3f7cfacd527a6efd9d106e06825bd","points":"7.142857143"},
{"toAddress":"0x940dea37db7055480236c3ff7b01353820397a70","points":"7.142857143"},
{"toAddress":"0x945ae4fb999baf5c3c8988941a1ca16ed68d31ef","points":"7.142857143"},
{"toAddress":"0x98b833c4ec4464ee4c8ca452cadaa1159f60f2f0","points":"8.171118918"},
{"toAddress":"0x261fb7c6df525f557aeb2dd3336510fc29c39441","points":"7.142857143"},
{"toAddress":"0x4f8382f3d38108128e98b621f7370179dd99e1b6","points":"7.142857143"},
{"toAddress":"0x60d7bf75d84d4322e7f73daf019e54be73db8d4c","points":"7.142857143"},
{"toAddress":"0x78aaacd130134a15a42a3791043f0040c733389b","points":"7.142857143"},
{"toAddress":"0xc667891581280551ad01a0feece6b925d9c9bb08","points":"7.142857143"},
{"toAddress":"0xcf921619da0f5b3ae0a40e286b85b4a530e4e654","points":"7.142857143"},
{"toAddress":"0x7e0bed47bf81ae705a1b6e787bcd87a9ffd14435","points":"7.142857143"},
{"toAddress":"0xe05e33fd09da0b23ed4d8ded64d3f702a1f196fb","points":"7.142857143"},
{"toAddress":"0x869b678387bb473721ce2ee4ad46af37e754bbd9","points":"7.142857143"},
{"toAddress":"0xeccc3c80e9d8a3037bb1b5958869cea5e1adc7a1","points":"7.142857143"},
{"toAddress":"0xecf3166c40317d399d20238d0833d5f745caecca","points":"7.142857143"},
{"toAddress":"0x9868f736e93ad29d2a30f2e85d12b3ac4c3225b8","points":"40"}
      ],
    "secondsToFinalize": 3600
}'

- Get Batch

curl --request GET \
  --url https://waitlist-api.prod.blast.io/v1/contracts/0xe498a3967Cd73153890095A6Be3F6853421342B6/batches \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x4RlPARIqAnqhddHa1KX37PvSVJxFc-il0tACq-z6nA'



— ADD D APP 

curl --request POST \
  --url https://waitlist-api.prod.blast.io/v1/operators/0x4225d96C1d59D935c2b004823C184C4D9caF159e/dapp-info \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.4Uf4P_LOKjF_rQ_P2uTUqxn8Q1uObtRa3X8HEx_s72g' \
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
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.MZIMj7SWnCScqrh55bic9WhEG69vwXZ3J6lw-i3j-zQ' \
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

  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9._ju2c-ZuySaMjI9bhunNHuDNcVLiUXfxaE-kpjTmaR0'
{"success":true,"balancesByPointType":{"DEVELOPER":{"available":"0","pendingSent":"0","earnedCumulative":"0","receivedCumulative":"0","finalizedSentCumulative":"0"},"LIQUIDITY":{"available":"213720.811266408549","pendingSent":"0","earnedCumulative":"213653.229700734883","receivedCumulative":"77.581565673666","finalizedSentCumulative":"10","byAsset":{"ETH":{"earnedCumulative":"0","earnedCumulativeBlock":5263294},"WETH":{"earnedCumulative":"213653.229700734883","earnedCumulativeBlock":5263293},"USDB":{"earnedCumulative":"0","earnedCumulativeBlock":5263293}}}}}%         

*/