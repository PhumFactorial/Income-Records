const hre = require("hardhat");

async function main() {

  const RecieptStorage = await hre.ethers.getContractFactory("RecieptStorage");
  const recieptStorage = await RecieptStorage.deploy("RecieptStorage Storage Deployed");

  await recieptStorage.deployed();

  console.log("RecieptStorage deployed to:", recieptStorage.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
