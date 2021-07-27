pragma solidity >=0.4.22 <0.6.0;

/**
 * Contract responsible for the encapsulating
 * the primitive implementation of what a decentralized twitter
 * would look like.  At a high level, this involves creating
 * new metadata entries (i.e. users and posts) and getting said metadata.
 * Notice, metadata is used here, as only reference values are stored
 * on the blockchain, while the actual content is stored on IPFS.
 */
contract DecentralizedTwitter {
  /******************************
   * State
   ******************************/

  string public name = "DecentralizedTwitter";
  mapping (address => User) users;
  Post[] posts;

  /******************************
   * Structs
   ******************************/

  /**
   * @description struct representing a post
   */
  struct Post {
    int postId;
    uint userId;
  }

  /**
   * @description struct representing a user;
   * for sake of simplicity, the address is used
   * for username
   */
  struct User {
    uint userId;
    address username;
    bool exists;
  }

  /******************************
   * Events
   ******************************/

  event UserCreated(
    uint userId,
    address username,
    bool exists
  );

  event PostCreated(
    int postId,
    uint userId
  );

  /******************************
   * Methods
   ******************************/

  function createPost(int postId, uint userId) public {
    address sender = msg.sender;
    require(users[sender].exists && users[sender].userId == userId);
    Post memory newPost = Post(postId, userId);
    posts.push(newPost);
    emit PostCreated(postId, userId);
  }

  function createUser(uint userId) public {
    address sender = msg.sender;
    require(users[sender].exists == false);
    User memory newUser = User(userId, sender, true);
    users[sender] = newUser;
    emit UserCreated(userId, sender, true);
  }

  function getPosts() public view returns (int[] memory postIds, uint[] memory userIds) {
    (postIds, userIds) = getPostsForFeed(true, 0);
  }

  function getPostsForUser(uint userId) public view returns (int[] memory postIds) {
    (postIds, ) = getPostsForFeed(false, userId);
  }

  function getPost(int idForPostBeingSearched) public view returns (int postId, uint userId) {
    Post memory post = Post(-1, 0); // default

    for (uint i = 0; i < posts.length; i++) {
      if (posts[i].postId == idForPostBeingSearched) {
        post = posts[i];
      }
    }

    return (post.postId, post.userId);
  }

  function getUser() public view returns (uint userId, address username, bool exists) {
    User memory user = users[msg.sender];
    return (user.userId, user.username, user.exists);
  }

  /******************************
   * Helpers
   ******************************/

  /**
   * Useful function for telling the main private method below,
   * which returns a dynamically length array, how many posts to expect.
   */
  function getNumberOfPosts(bool feedIsHome, uint userId) private view returns (uint numberOfPosts) {
    numberOfPosts = 0;

    for (uint i = 0; i < posts.length; i++) {
      if (shouldIncludePostInFeed(feedIsHome, i, userId)) {
        numberOfPosts = numberOfPosts + 1;
      }
    }
  }

  /**
   * Interesting function reused for both home and profile views.
   * It's responsible for getting all of the relevant post ids for a given feed,
   * which again, can be profile or home feed.  Notice, it's interesting b/c
   * the array is constructed in such a way that the newest posts need to be in
   * the front of the array.  Thus, to do so, a backwards loop is used.
   */
  function getPostsForFeed(bool feedIsHome, uint userId) private view returns (int[] memory postIds, uint[] memory userIds) {
    uint numberOfPosts = getNumberOfPosts(feedIsHome, userId);
    uint counter = 0; // used for constructing array backwards, since push cannot be used; 0 based for index purposes

    postIds = new int[](numberOfPosts);
    userIds = new uint[](numberOfPosts);

    for (uint i = posts.length - 1; i != 0; i--) {
      if (shouldIncludePostInFeed(feedIsHome, i, userId)) {
        postIds[counter] = posts[i].postId;
        userIds[counter] = posts[i].userId;
        counter = counter + 1;
      }
    }

    /**
     * HACK: Used to check first index, since it is not checked above
     */
    if (shouldIncludePostInFeed(feedIsHome, 0, userId)) {
      postIds[counter] = posts[0].postId;
      userIds[counter] = posts[0].userId;
    }

    return (postIds, userIds);
  }

  /**
   * Used to encapsulate the simple logic that is reused in multiple
   * other private methods; it's also used to help provide context around
   * what is happening in private functions above.
   */
  function shouldIncludePostInFeed(bool feedIsHome, uint postIndex, uint userId) private view returns (bool include) {
    include = feedIsHome == true || posts[postIndex].userId == userId;
  }
}