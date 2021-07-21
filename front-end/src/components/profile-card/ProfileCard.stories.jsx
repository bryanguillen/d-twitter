import React from 'react';

import ProfileCard from './ProfileCard';

export default {
  title: 'Components/ProfileCard',
  component: ProfileCard
};

const Template = (args) => <ProfileCard {...args} />

export const ProfileCardStory = Template.bind({});
ProfileCardStory.args = {
  userImageUrl: 'https://d-twitter.s3.us-east-2.amazonaws.com/default-profile-pic.jpg',
  username: 'React JS'
};