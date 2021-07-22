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
   * Methods
   ******************************/

  function createPost(int postId, uint userId) public {
    address sender = msg.sender;
    require(users[sender].exists && users[sender].userId == userId);
    Post memory newPost = Post(postId, userId);
    posts.push(newPost);
  }

  function createUser(uint userId) public {
    address sender = msg.sender;
    require(users[sender].exists == false);
    User memory newUser = User(userId, sender, true);
    users[sender] = newUser;
  }

  function getRecentPosts(int idForLastPostSeen) public view returns (int[] memory postIds, uint[] memory userIds) {
    uint index = findIndexForPost(idForLastPostSeen);
    uint numberOfPosts = getNumberOfPosts(index); // used to get the length for the memory arrays =(

    uint counter = 0;
    postIds = new int[](numberOfPosts);
    userIds = new uint[](numberOfPosts);

    while (counter < 10) {
      postIds[counter] = posts[index].postId;
      userIds[counter] = posts[index].userId;
      counter = counter + 1;
      index = index - 1;
      if (index == 0) {
        break;
      }
    }

    return (postIds, userIds);
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

  function getNumberOfPosts(uint indexForPost) private pure returns (uint numberOfPosts) {
    numberOfPosts = 0;
    uint i = indexForPost;

    while (numberOfPosts < 10) {
      numberOfPosts = numberOfPosts + 1;
      i = i - 1;
      if (i == 0) {
        break;
      }
    }
  }
}