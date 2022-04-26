// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const addr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  if (addr == "0x0") {
    console.log("Please set the contract addr");
    return;
  }
  
  const abi = ["event Winner(address winnerAddr)"];

  const [wallet] = await ethers.getSigners();

  var ch2 = new ethers.Contract(addr, abi, wallet);

  var func_selector = "0x1ab0cb3a"
  var answer = 1234
  var packed_data = ethers.utils.solidityPack(["bytes4", "uint"], [func_selector, answer]);

  var tx = await wallet.sendTransaction({
    to: ch2.address,
    data: packed_data,
  });
  var rec = await tx.wait();

  // Listen for the Winner event
  let iface = new ethers.utils.Interface(abi);
  let log;
  if (rec.logs.length != 0) {
    log = iface.parseLog(rec.logs[0]); // here you can add your own logic to find the correct log
    console.log('Beat the challenge, Winner event emitted!')
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
