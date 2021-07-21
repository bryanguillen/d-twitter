const DecentralizedTwitter = artifacts.require("./DecentralizedTwitter.sol");

contract("DecentralizedTwitter", accounts => {
  describe("createUser", () => {
    let decentralizedTwitter;
    
    beforeEach(async () => {
      decentralizedTwitter = await DecentralizedTwitter.deployed();
    });
    
    it("should add user to users if all id is valid and user has not been added yet", async () => {
      const secondAccount = accounts[1];
      const USER_ID = 1;
      await decentralizedTwitter.createUser(USER_ID, { from: secondAccount });
      const user = await decentralizedTwitter.getUser({ from: secondAccount });
      assert.equal(user.username, accounts[1]);
      assert.equal(user.userId, USER_ID);
    });
    
    it("should not add user to users user is already added", async () => {
      const secondAccount = accounts[1];
      const USER_ID = 1;
      try {
        await decentralizedTwitter.createUser(USER_ID, { from: secondAccount });
      } catch (error) {
        assert.ok(error);
      }
    });
  });
  
  describe("getUser", () => {
    let decentralizedTwitter;
    
    before(async () => {
      decentralizedTwitter = await DecentralizedTwitter.deployed();
      await decentralizedTwitter.createUser(0);
    });
    
    it("should get user if user exists", async () => {
      const user = await decentralizedTwitter.getUser();
      assert.equal(user.username, accounts[0]);
      assert.equal(user.userId, 0);
    });
    
    it("should get user if user exists", async () => {
      const secondAccount = accounts[1];
      const user = await decentralizedTwitter.getUser({ from: secondAccount });
      const userFound = accounts.find(account => account === user.username) !== undefined;
      assert.notOk(userFound);
    });
  });
});
