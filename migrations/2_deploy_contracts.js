var DecentralizedTwitter = artifacts.require("./DecentralizedTwitter.sol");

module.exports = function(deployer) {
  deployer.deploy(DecentralizedTwitter);
};
