# Blockchain Contract Interaction and NFT Bulk Sending

## Overview

This project provides tools and scripts to interact with blockchain smart contracts, primarily focusing on:

- **Bulk sending NFTs and ETH transactions**  
- **Encoding contract ABI interactions**  
- **Signing transactions with private keys**  
- **Automating game-related contract interactions**  

The repository includes contract ABI files, transaction data, and automation scripts.

## Features

- **Mass Send ETH (`mass-send-eth.js`)**: Automates Ethereum mass transactions.  
- **Bulk Send NFTs (`bulk-send-nfts.js`)**: Transfers multiple NFTs in one batch.  
- **Contract ABI Encoding (`encodeContractABI.js`)**: Encodes data for smart contract interactions.  
- **Private Key Signing (`signPrivateKey.js`)**: Signs transactions securely using a private key.  
- **Game & NFT Contract Interaction (`contract-interaction/`)**:
  - Manages NFT transactions.
  - Handles in-game smart contract functions (e.g., crafting, mining, location interactions).
  - Listens for blockchain contract events.

## Contract Usage in `contract-interaction`

1. Add the proper private signing key of the revelant wallet
2. Update the contract address
3. Edit to use the relevant functions in the code.

```
node encodeContractABI.js
node bulk-send-nfts.js
node mass-send-eth.js
node encodeContractABI.js
node signPrivateKey.js
```

