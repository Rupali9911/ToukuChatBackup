import {Platform, StyleSheet} from 'react-native';

export default StyleSheet.create({
  keyboardScrollContentContainer: {
    flex: Platform.isPad ? 1 : 0,
    padding: 20,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    width: Platform.isPad ? '75%' : '100%',
    alignSelf: 'center',
    justifyContent: Platform.isPad ? 'center' : 'flex-start',
  },
  createTicket: {
    fontSize: 30,
    marginVertical: 50,
    opacity: 0.8,
  },
  subContainer: {
    justifyContent: 'center',
  },
  dropdownContainer: {
    paddingBottom: 30,
    zIndex: 100,
    overflow: 'visible',
  },
  submitButttonContainer: {
    marginTop: 30,
    zIndex: 0,
    overflow: 'visible',
    backgroundColor: 'red',
  },
});
