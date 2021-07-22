const DecentralizedTwitter = artifacts.require("./DecentralizedTwitter.sol");

describe("DecentralizedTwitter", () => {
  contract("getUser", (accounts) => {
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
  });

  contract("createUser", (accounts) => {
    let decentralizedTwitter;
    
    beforeEach(async () => {
      decentralizedTwitter = await DecentralizedTwitter.deployed();
    });
    
    it("should add user to users if id is valid and user has not been added yet", async () => {
      const firstAccount = accounts[0];
      const USER_ID = 0;
      await decentralizedTwitter.createUser(USER_ID, { from: firstAccount });
      const user = await decentralizedTwitter.getUser({ from: firstAccount });
      assert.equal(user.username, firstAccount);
      assert.equal(user.userId, USER_ID);
    });
    
    it("should not add user to users user is already added", async () => {
      const firstAccount = accounts[0];
      const USER_ID = 0;
      try {
        await decentralizedTwitter.createUser(USER_ID, { from: firstAccount });
      } catch (error) {
        assert.ok(error);
      }
    });
  });

  contract("getPost", (accounts) => {
    const USER_ID = 0;
    const POST_ID = 0;
    const firstAccount = accounts[0];
    let decentralizedTwitter;
    
    before(async () => {
      decentralizedTwitter = await DecentralizedTwitter.deployed();
      await decentralizedTwitter.createUser(USER_ID, { from: firstAccount });
      await decentralizedTwitter.createPost(POST_ID, USER_ID, { from: firstAccount });
    });

    it("should get post", async () => {
      const post = await decentralizedTwitter.getPost(POST_ID, { from: firstAccount });
      assert.equal(post.postId, POST_ID);
      assert.equal(post.userId, USER_ID);
    });

    it("should handle case where post does not exist", async () => {
      const post = await decentralizedTwitter.getPost(10, { from: firstAccount });
      assert.equal(post.postId, -1);
      assert.equal(post.userId, 0);
    });
  });

  contract("createPost", (accounts) => {
    const USER_ID = 0;
    let decentralizedTwitter;
    
    before(async () => {
      decentralizedTwitter = await DecentralizedTwitter.deployed();
      await decentralizedTwitter.createUser(USER_ID);
    });

    it("should create post if user and postId exists", async () => {
      const POST_ID = 1;
      await decentralizedTwitter.createPost(POST_ID, USER_ID);
      const post = await decentralizedTwitter.getPost(POST_ID);
      assert.equal(post.userId, USER_ID);
      assert.equal(post.postId, POST_ID);
    });
  });

  contract("getRecentPosts", (accounts) => {
    let decentralizedTwitter;
    
    before(async () => {
      decentralizedTwitter = await DecentralizedTwitter.deployed();
      await decentralizedTwitter.createUser(0);
      await createPosts(decentralizedTwitter, 25, 0);
    });
    
    it("should get the newest ten posts if no posts seen previously", async () => {
      const results = await decentralizedTwitter.getRecentPosts(-1);
      const postIds = results.postIds.map(postId => parseInt(postId.toString()));
      const userIds = results.userIds.map(userId => parseInt(userId.toString()));
      assert.equal(postIds.length, 10);
      assert.equal(userIds.length, 10);
      assert.deepEqual(postIds, [24, 23, 22, 21, 20, 19, 18, 17, 16, 15]);
      assert.deepEqual(userIds, Array.from({ length: 10 }, () => 0));
    });

    it("should be able to handle use case where less than 10 and not starting from beginning", async () => {
      const results = await decentralizedTwitter.getRecentPosts(5);
      const postIds = results.postIds.map(postId => parseInt(postId.toString()));
      const userIds = results.userIds.map(userId => parseInt(userId.toString()));
      assert.equal(postIds.length, 5);
      assert.equal(userIds.length, 5);
      assert.deepEqual(postIds, [4, 3, 2, 1, 0]);
      assert.deepEqual(userIds, Array.from(5, () => 0));
    });
  });
});

/**
 * @description Helper function for encapsulating the code needed to create
 * 25 posts; 25 is an arbitrary number chosen, this plus the 2 created in previous
 * tests equals 27, which will allow less than ten use case to be tested.  Note:
 * The user id 0 is used purposely
 * @param {Object} decentralizedTwitterInstance
 * @param {Object} numberOfPosts
 * @param {Object} userId
 * @returns {}
 */
async function createPosts(decentralizedTwitterInstance, numberOfPosts, userId) {
  for (let i = 0; i < numberOfPosts; i++) {
    const postId = i;
    await decentralizedTwitterInstance.createPost(postId, userId);
  }
}
