require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("./tasks/deploy") // add for hardhat deploying

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  }
};
