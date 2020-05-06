import {StyleSheet} from 'react-native';
import {Colors} from '../../constants';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 14,
    paddingVertical: 5,
    textAlign: 'center',
    color: Colors.white,
  },
  underlineTxt: {
    fontSize: 14,
    paddingVertical: 5,
    textAlign: 'center',
    color: Colors.white,
    textDecorationLine: 'underline',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
