import {Platform, StyleSheet} from 'react-native';

export default StyleSheet.create({
  keyboardScrollContentContainer: {
    flex: 1,
    padding: 20,
  },
  singleFlex: {
    flex: 1,
  },
  recoverUsername: {
    marginVertical: 50,
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    width: Platform.isPad ? '75%' : '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
