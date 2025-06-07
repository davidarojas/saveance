/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Purple colors for light mode
const lightPrimary = '#5A189A';
const lightAccent = '#9D4EDD'; // or #7B2CBF
const lightBackground = '#E0AAFF';
const lightCard = '#C77DFF';
const lightText = '#10002B'; // or #240046
const lightBorder = '#9D4EDD'

// Purple colors for dark mode
const darkPrimary = '#9D4EDD';
const darkAccent = '#C77DFF'; // or #E0AAFF
const darkBackground = '#10002B';
const darkCard = '#240046'; // or #3C096C
const darkText = '#E0AAFF'; // or #FFFFFF
const darkBorder = '#5A189A';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#f4f5f6',
    card: lightCard,
    primary: lightPrimary,
    accent: lightAccent,
    border: lightBorder,
    icon: lightAccent,
    tabIconDefault: '#687076',
    tabIconSelected: lightPrimary,
    label: '#43484C',
    placeholder: '#737D82'
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212',
    card: darkCard,
    primary: darkPrimary,
    accent: darkAccent,
    border: darkBorder,
    icon: darkAccent,
    tabIconDefault: '#A9AEB2',
    tabIconSelected: darkPrimary,
    label: '#C9CCCF',
    placeholder: '#7D848C'
  },
};
