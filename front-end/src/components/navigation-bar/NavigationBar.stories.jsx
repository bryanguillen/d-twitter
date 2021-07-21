import React from 'react';

import NavigationBar from './NavigationBar';

export default {
  title: 'Components/NavigationBar',
  component: NavigationBar
};

const Template = (args) => <NavigationBar {...args} />

export const NavigationBarStory = Template.bind({});
NavigationBarStory.args = {
  handleClickOnHome: undefined
};