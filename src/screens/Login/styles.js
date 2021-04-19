import {Platform, StyleSheet} from 'react-native';
import {Colors} from '../../constants';

export default StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  keyboardScrollContentContainer: {
    flex: Platform.isPad ? 1 : 0,
  },
  container: {
    flex: 1,
    width: Platform.isPad ? '75%' : '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    justifyContent: Platform.isPad ? 'center' : 'flex-start',
  },
  usernameOrEmailText: {
    textAlign: 'left',
    marginTop: -10,
    marginStart: 10,
    marginBottom: 5,
  },
  password: {
    textAlign: 'left',
    marginTop: -10,
    marginStart: 10,
    marginBottom: 5,
  },
  supportContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  supportSubContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  supportText: {
    marginHorizontal: 5,
  },
  loginWithText: {
    marginTop: 25,
    alignItems: 'center',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  needSupportContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
