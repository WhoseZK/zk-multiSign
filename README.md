## Introduction
ZK-MultiSign is the project for developing anonymous multiSign mechanism based on Zero Knowledge Proof. Our target is making ZK-MultiSign using in any application. In this project we show how it works in the wallet.

## Concept of ZK-MultiSign 
Please see [the power point](https://docs.google.com/presentation/d/1I1bcazjK74sQx2VjOAX-NzNMzVvrZ210xgjGGfErXHc/edit#slide=id.p) for the flow.

## emo project
> We developed the simple react project for behavior demo .
### Clone the project
```sh
$ git clone git@github.com:WhoseZK/zk-wallet.git
$ cd zk-wallet
```
### Deploy Contracts (Local)
- navigate to hardhat directory, install dependencies and run a local node
```sh
$ cd hardhat
$ npm i
$ npx hardhat node
```
- open a new terminal at the same directory, and deploy verifier contracts on local node.
```sh
$ npm run deploy-local
```
### Execute Local Frontend 
- navigate to frontend directory, install dependencies and start a frontend app
```sh
$ cd ../ && cd frontend
$ npm i
$ npm run dev
```

### Register users
1. open the browser and switch the network to localhost
2. open the terminal of local node and get one private key to import into metamask
3. click connect wallet button on the frontend app
4. enter user name and click append user to create new member (add 3 - 5 users)

### Deploy zkWallet 
1. enter deploy button to deploy zk wallet for members

### Raise and execute transaction (Repeat the flow)
1. the member of zk wallet can fill destination address, token address, amount then raises the transaction
2. other members can see the transaction details by new transaction event and click approve button if they agree with this transaction. This action will send zkp inputs to the relayer
3. if the approval meet the threshold, the relayer will forward all necessary zkp inputs to the transaction raiser
4. transaction raiser can execute the transaction by clicking the send transaction button. The relayer will send the transaction to the zk wallet

