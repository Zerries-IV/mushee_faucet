const Faucet = artifacts.require("Faucet")
const ADDRESS = import.meta.env.FAUCET_ADDRESS

module.exports = async function(deployer){
    await deployer.deploy(Faucet, ADDRESS)
}