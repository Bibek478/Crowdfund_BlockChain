require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const privateKey = process.env.PRIVATE_KEY?.trim().replace(/^0x/, '');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    sepolia: {
      url: 'https://ethereum-sepolia-rpc.publicnode.com',
      accounts: privateKey ? [`0x${privateKey}`] : [],
    },
  },
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
