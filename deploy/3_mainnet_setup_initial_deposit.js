const { ethers } = require("hardhat");

const setupChild = async function (hre) {
  const { deployments } = hre
  const { log } = deployments
  const { deployer } = await getNamedAccounts()

  log('----------------------------------------------------')
  log('Initial deposit to setup mapping...')

  const fxRootAddress = process.env.ROOT_ADDRESS
  const breedAddress = process.env.BREED_ADDRESS

  const rootTunnelContract = await ethers.getContractAt(
    "FxERC20RootTunnel",
    fxRootAddress
  );

  const breedContract = await ethers.getContractAt(
    "ERC20",
    breedAddress
  )

  log('Approving root contract...')
  await (await breedContract.approve(rootTunnelContract.address, ethers.utils.parseEther("12"))).wait()
  log('Initial deposit...')
  await (await rootTunnelContract.deposit(breedAddress, deployer, ethers.utils.parseEther("12"), ethers.constants.HashZero)).wait()
  log('Done')

  const maticBreed = await rootTunnelContract.rootToChildTokens(breedAddress)
  log('Matic Breed will be deployed to: ', maticBreed)
}

module.exports = setupChild
setupChild.tags = ['initialDeposit']
