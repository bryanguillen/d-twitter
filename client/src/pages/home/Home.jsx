import { useState } from 'react';
import CreatePostForm from '../../components/create-post-form/CreatePostForm';
import './Home.css';

export default function Home() {
  const [postForm, setPostForm] = useState({ file: null, value: '', error: false });

  /**
   * @description on submit handler for creat post form
   * @param {Object} event
   */
  function onSubmit(event) {
    event.preventDefault();
    console.log(postForm);
  }

  return (
    <div className="home">
      <CreatePostForm
        error={postForm.error}
        value={postForm.value}
        onChangeFileInput={event => event.target.files.length === 1 ? setPostForm(previousState => ({ ...previousState, file: event.target.files[0] })) : undefined}
        onChangeTextInput={event => setPostForm(previousState => ({ ...previousState, value: event.target.value }))}
        onSubmit={(event) => onSubmit(event)}
      />
    </div>
  );
}