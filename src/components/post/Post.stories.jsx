import React from 'react';

import Post from './Post';

export default {
  title: 'Components/Post',
  component: Post
};

const Template = (args) => <Post {...args} />

export const PostWithTextOnly = Template.bind({});
PostWithTextOnly.args = {
  imageUrl: '',
  numLikes: 5,
  postLiked: false,
  text: 'Post with text only',
  userImageUrl: '',
  username: 'React JS'
};
