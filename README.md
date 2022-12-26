1. clone the project
```sh
$ git clone git@github.com:WhoseZK/zk-wallet.git
$ cd zk-wallet
```
2. navigate to hardhat directory, and run a local node
```sh
$ cd hardhat
$ npx hardhat node
```
3. open a new terminal at the same directory, and deploy verifier contract on local node.
```sh
$ npm run deploy-local
```
4. navigate to frontend directory and start a frontend app
```sh
$ cd ../ && cd frontend
$ npm run dev
```
5. open the browser and switch the network to localhost
6. open the terminal of local node and get one private key to import into metamask
7. click connect wallet button on the frontend app
8. click create points to have three points for three members
9. click getZkp to get the ZKP for transfer token
10. click creat zk wallet to deploy zk wallet contract
11. fill the arguments for transfer token function and click transfer token to send the transaction