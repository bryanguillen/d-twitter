pragma solidity >=0.4.22 <0.6.0;

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
    uint postId;
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

  function createPost(uint postId, uint userId) public {
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

  function getPost(uint idForPostBeingSearched) public view returns (uint postId, uint userId) {
    Post memory post;

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
}