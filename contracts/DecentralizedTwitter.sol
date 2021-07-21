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

  function createUser(uint userId) public {
    address sender = msg.sender;
    require(users[sender].exists == false);
    User memory newUser = User(userId, sender, true);
    users[sender] = newUser;
  }

  function getUser() public view returns (uint userId, address username, bool exists) {
    User memory user = users[msg.sender];
    return (user.userId, user.username, user.exists);
  }
}