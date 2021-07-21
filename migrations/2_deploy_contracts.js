var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var DecentralizedTwitter = artifacts.require("./DecentralizedTwitter.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(DecentralizedTwitter);
};
