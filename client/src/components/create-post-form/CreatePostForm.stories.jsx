import React, { useState } from 'react';

import CreatePostForm from './CreatePostForm';

export default {
  title: 'Components/CreatePostForm',
  component: CreatePostForm
};

const Template = (args) => {
  const [value, setValue] = useState('');

  return (
    <CreatePostForm
      error={args.error}
      onChangeTextInput={event => setValue(event.target.value)}
      onSubmit={event => event.preventDefault()}
      value={value}
    />
  );
};

export const CreatePostFormStory = Template.bind({});
CreatePostFormStory.args = {
  error: false
};
