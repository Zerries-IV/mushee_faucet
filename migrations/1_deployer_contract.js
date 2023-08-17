const TestFaucet = artifacts.require("TestFaucet")

module.exports = async function(deployer){
    await deployer.deploy(TestFaucet, '0x3255106D0f9cDEF1204054EC51884E924C28dF4b')
}