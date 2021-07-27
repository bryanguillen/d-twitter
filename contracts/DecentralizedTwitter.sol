pragma solidity >=0.4.22 <0.6.0;

/**
 * TODO Handle case where post id already exists for creating post
 * TODO Handle case where user id already exists for creating user
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

  function getPosts() public view returns (int[] memory postIds) {
    postIds = getPostsForFeed(true, 0);
  }

  function getPostsForUser(uint userId) public view returns (int[] memory postIds) {
    postIds = getPostsForFeed(false, userId);
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

  function findIndexForPost(int idForLastPostSeen) private view returns (uint index) {
    if (idForLastPostSeen == -1) {
      index = posts.length - 1;
    } else {
      for (uint i = 0; i < posts.length; i++) {
        if (idForLastPostSeen == posts[i].postId) {
          index = i - 1;
          break;
        }
      }
    }
  }

  function getNumberOfPosts(bool feedIsHome, uint userId) private view returns (uint numberOfPosts) {
    numberOfPosts = 0;

    for (uint i = 0; i < posts.length; i++) {
      /**
       * Handle both use cases -- user profile and home
       */
      if (shouldIncludePostInFeed(feedIsHome, i, userId)) {
        numberOfPosts = numberOfPosts + 1;
      }
    }
  }

  function getPostsForFeed(bool feedIsHome, uint userId) private view returns (int[] memory postIds) {
    uint numberOfPosts = getNumberOfPosts(feedIsHome, userId);
    uint counter = 0; // used for constructing array backwards, since push cannot be used; 0 based for index purposes

    postIds = new int[](numberOfPosts);

    for (uint i = posts.length - 1; i != 0; i--) {
      if (shouldIncludePostInFeed(feedIsHome, i, userId)) {
        postIds[counter] = posts[i].postId;
        counter = counter + 1;
      }
    }

    /**
     * HACK: Used to check first index, since it is not checked above
     */
    if (shouldIncludePostInFeed(feedIsHome, 0, userId)) {
      postIds[counter] = posts[0].postId;
    }

    return postIds;
  }

  function shouldIncludePostInFeed(bool feedIsHome, uint postIndex, uint userId) private view returns (bool include) {
    include = feedIsHome == true || posts[postIndex].userId == userId;
  }
}