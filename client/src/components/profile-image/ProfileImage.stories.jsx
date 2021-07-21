import React from 'react';

import ProfileImage from './ProfileImage';

export default {
  title: 'Components/ProfileImage',
  component: ProfileImage
};

const Template = (args) => <ProfileImage {...args} />

export const ProfileImageStory = Template.bind({});
ProfileImageStory.args = {
  url: 'https://d-twitter.s3.us-east-2.amazonaws.com/default-profile-pic.jpg'
};