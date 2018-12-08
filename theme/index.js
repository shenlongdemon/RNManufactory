import customTheme from './theme';

export default () => {
  const theme = {
    'My.CustomComponent': {
      ...customTheme()
    },
  }
  return theme;
};