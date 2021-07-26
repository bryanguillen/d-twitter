import { useEffect, useState } from 'react';
import CreatePostForm from '../../components/create-post-form/CreatePostForm';
import './Home.css';

export default function Home({
  account,
  stores,
  decentralizedTwitterContract
}) {
  const [postForm, setPostForm] = useState({ value: '', error: false });

  useEffect(() => {
    setupNewPostListener();
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
  
      // get new id
      const postId = await getIdForNewPost();
  
      // create post
      await post.put({ _id: postId, value: value, userId: id });

      // add new post to blockchain
      await decentralizedTwitterContract.methods.createPost(postId, id).send({ from: address });
    
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