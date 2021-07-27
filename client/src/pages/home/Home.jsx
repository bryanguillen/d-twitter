import { useEffect, useState } from 'react';
import CreatePostForm from '../../components/create-post-form/CreatePostForm';
import Post from '../../components/post/Post';
import './Home.css';

export default function Home({
  account,
  stores,
  decentralizedTwitterContract
}) {
  const [postForm, setPostForm] = useState({ value: '', error: false });
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    (async function() {
      setupNewPostListener();
      setFeed(await getPosts());
    })();
  }, []);

  /**
   * @description Function for getting a new id for a new post
   * @returns {undefined} 
   * @TODO The same as the one in App.jsx
   */
  async function getIdForNewPost() {
    const { post } = stores;
    const posts = await post.get('');
    return posts.length > 0 ? posts[posts.length - 1]._id + 1 : 1;
  }

  /**
   * @description Function used for getting the posts for page
   * @returns {Array<Object>}
   */
  async function getPosts() {
    const { post, user } = stores;
    const postMetadata = await decentralizedTwitterContract.methods.getPosts().call();
    const postIds = postMetadata.postIds.map(id => parseInt(id));
    const userIds = postMetadata.userIds.map(id => parseInt(id));
    const userData = await user.query(doc => userIds.includes(parseInt(doc._id)));
    const postData = await post.query(doc => postIds.includes(parseInt(doc._id)));
    const getUserData = (userId) => userData.find(user => parseInt(user._id) === userId);
    return postData.map((post) => ({ ...post, ...getUserData(parseInt(post.userId)) })).reverse(); // needed to ensure order?
  }

  /**
   * @description on change handler for form
   * @param {Object} event
   */
  function onChange(event) {
    const { value } = event.target;
    const { error } = postForm;
    /**
     * NOTE: For error, the logic simply says, "if it is true
     * and the value is still empty, then leave error, otherwise
     * takeaway error".  This is useful for when the user submits
     * empty form, so that the error can disappear once the user
     * starts typing, thus, providing quicker feedback.
     */
    setPostForm({ value, error: error && value.trim().length === 0 });
  }

  /**
   * @description on submit handler for creat post form
   * @param {Object} event
   */
  async function onSubmit(event) {
    // prevent submission
    event.preventDefault();

    const { value } = postForm;
    const formCanBeSubmitted = value.trim().length > 0;
    
    if (formCanBeSubmitted) {
      // get relevant store
      const { post } = stores;

      // account
      const { id, address } = account;
      const parsedId = parseInt(id);
  
      // get new id
      const postId = await getIdForNewPost();
  
      // create post
      await post.put({ _id: postId, value: value, userId: parsedId });

      // add new post to blockchain
      await decentralizedTwitterContract.methods.createPost(postId, parsedId).send({ from: address });
    
      // reset postForm
      setPostForm({ value: '', error: false });
    } else {
      setPostForm(previousState => ({ ...previousState, error: true }));
    }
    
  }

  /**
   * @description Setting event handler for new post
   */
  function setupNewPostListener() {
    decentralizedTwitterContract.events.PostCreated({}, () => console.log('new post'));
  }

  return (
    <div className="home">
      {account.id ?
        <CreatePostForm
          error={postForm.error}
          value={postForm.value}
          onChangeTextInput={onChange}
          onSubmit={onSubmit}
        /> : 
        null
      }
      {
        feed.map((post, index) => (
          <Post
            key={index}
            numLikes={0}
            postLiked={false}
            text={post.value}
            userId={post.userId}
            userImageUrl={'https://d-twitter.s3.us-east-2.amazonaws.com/default-profile-pic.jpg'}
            username={post.username}
          />
        ))
      }
    </div>
  );
}