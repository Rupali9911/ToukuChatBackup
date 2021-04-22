import {Platform, StyleSheet} from 'react-native';

export default StyleSheet.create({
  scrollContentContainer: {
    flex: Platform.isPad ? 1 : 0,
    padding: 20,
  },
  container: {
    flex: 1,
    width: Platform.isPad ? '60%' : '100%',
    alignSelf: 'center',
  },
  subContainer: {
    flex: 1,
    justifyContent: Platform.isPad ? 'center' : 'flex-start',
    alignItems: 'center',
  },
  connectedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  theWorldIsConnectedText: {
    marginEnd: 10,
  },
  connectedByToukuText: {
    marginTop: -1,
  },
  loginContainer: {
    width: Platform.isPad ? '45%' : '100%',
  },
  loginWithContainer: {
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  socialLoginImage: {
    marginHorizontal: 5,
    width: 45,
    height: 45,
  },
});
