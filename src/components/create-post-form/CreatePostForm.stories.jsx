import React, { useState } from 'react';

import CreatePostForm from './CreatePostForm';

export default {
  title: 'Components/CreatePostForm',
  component: CreatePostForm
};

const Template = (args) => {
  const [file, setFile] = useState(null);
  const [value, setValue] = useState('');

  return (
    <CreatePostForm
      error={args.error}
      onChangeFileInput={event => event.target.files.length === 1 ? setFile(event.target.files[0]) : undefined}
      onChangeTextInput={event => setValue(event.target.value)}
      onSubmit={event => event.preventDefault()}
      value={value}
    />
  );
};

export const NoError = Template.bind({});
NoError.args = {
  error: false
};

export const Error = Template.bind({});
Error.args = {
  error: true
};