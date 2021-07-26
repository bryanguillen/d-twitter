import React from 'react';

import Post from './Post';

export default {
  title: 'Components/Post',
  component: Post
};

const Template = (args) => <Post {...args} />

export const PostWithTextOnly = Template.bind({});
PostWithTextOnly.args = {
  numLikes: 5,
  postLiked: false,
  text: 'Post with text only',
  userImageUrl: 'https://d-twitter.s3.us-east-2.amazonaws.com/default-profile-pic.jpg',
  username: 'React JS'
};
