1. clone the project
```sh
$ git clone git@github.com:WhoseZK/zk-wallet.git
$ cd zk-wallet
```
2. navigate to hardhat directory, install dependencies and run a local node
```sh
$ cd hardhat
$ npm i
$ npx hardhat node
```
3. open a new terminal at the same directory, and deploy verifier contracts on local node.
```sh
$ npm run deploy-local
```
4. navigate to frontend directory, install dependencies and start a frontend app
```sh
$ cd ../ && cd frontend
$ npm i
$ npm run dev
```
5. open the browser and switch the network to localhost
6. open the terminal of local node and get one private key to import into metamask
7. click connect wallet button on the frontend app
8. enter user name and click append user to create new member (add 3 - 5 users)
9. enter deploy button to deploy zk wallet for members
10. the member of zk wallet can fill destination address, token address, amount then raises the transaction
11. other members can see the transaction details by new transaction event and click approve button if they agree with this transaction. This action will send zkp inputs to the relayer
12. if the approval meet the threshold, the relayer will forward all necessary zkp inputs to the transaction raiser
13. transaction raiser can execute the transaction by clicking the send transaction button. The relayer will send the transaction to the zk wallet