// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const TWRegistry = await hre.ethers.getContractFactory("TWRegistry");
  const TWFactory = await hre.ethers.getContractFactory("TWFactory");
  const tWRegistry = await TWRegistry.deploy(hre.ethers.constants.AddressZero);
  const tWFactory = await TWFactory.deploy(hre.ethers.constants.AddressZero, tWRegistry.address);

  await tWRegistry.deployed();
  await tWFactory.deployed();

  const registry = `registryAddress=${tWRegistry.address} \r\nfactoryAddress=${tWFactory.address}`;

  fs.writeFileSync("./.env", registry);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
