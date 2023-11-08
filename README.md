# Web3-connected Plattform

This repository includes the Backend using Nodejs, Express, MongoDB, Socket.io, ethers and the Frontend using Vite React, tailwindcss and Web3-Modal.
The main functionality is an ERC-20 Token sniper which listens to the Uniswap v2 Factory for 'Pair creation' events, to then buy a specified token contract immediatelly when firstly possible - as the pair creation event is emmitted for liquidity creation.

The Backend is responsible to run the bot.js script with given user input of the frontend, manage users' wallets and emmit messages through a websocket connection to the frontend while running the bot.
As the bot needs to be able to immediatelly execute transactions, a user's wallet connected through WalletConnect on the Frontend is only used to authenticate users who can then create themselves 'hotwallets' which are handled in an encrypted form on the backend.
