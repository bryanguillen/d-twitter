import { useEffect, useState } from 'react';
import CreatePostForm from '../../components/create-post-form/CreatePostForm';
import './Home.css';

export default function Home({
  account,
  stores,
  decentralizedTwitterContract
}) {
  const [idForLastPostSeen, setIdForLastPostSeen] = useState(-1);
  const [postForm, setPostForm] = useState({ value: '', error: false });

  useEffect(() => {
    (async function() {
      setupNewPostListener();
      const posts = await getPosts();
      console.log(posts);
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
    const { post } = stores;
    const postMetadata = await decentralizedTwitterContract.methods.getRecentPosts(idForLastPostSeen).call();
    const postIds = postMetadata.postIds.map(id => parseInt(id));
    return await post.query(doc => postIds.includes(parseInt(doc._id)));
  }

  /**
   * @description on submit handler for creat post form
   * @param {Object} event
   */
  async function onSubmit(event) {
    // prevent submission
    event.preventDefault();

    // validate
    const { error, value } = postForm;

    if (!error) {
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
      setPostForm({ value: '', file: null, error: false });
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
          onChangeFileInput={event => event.target.files.length === 1 ? setPostForm(previousState => ({ ...previousState, file: event.target.files[0] })) : undefined}
          onChangeTextInput={event => setPostForm(previousState => ({ ...previousState, value: event.target.value }))}
          onSubmit={(event) => onSubmit(event)}
        /> : 
        null
      }
    </div>
  );
}