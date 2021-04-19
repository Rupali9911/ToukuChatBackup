import {Platform, StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 12,
    padding: 15,
    textAlign: 'center',
    color: 'white',
  },
  keyboardScrollContentContainer: {
    padding: 20,
    flex: Platform.isPad ? 1 : 0,
  },
  resetPasswordText: {
    fontSize: 30,
    marginVertical: 50,
    opacity: 0.8,
  },
  subContainer: {
    flex: 1,
    width: Platform.isPad ? '75%' : '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  usernameText: {
    textAlign: 'left',
    marginTop: -10,
    marginStart: 10,
    marginBottom: 5,
  },
  errorText: {
    textAlign: 'left',
    marginTop: -10,
    marginStart: 10,
    marginBottom: 5,
  },
});
