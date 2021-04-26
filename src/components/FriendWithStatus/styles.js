import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    textAlign: 'left',
    marginStart: 15,
    flex: 1,
    fontWeight: '100',
  },
  buttonContainer: {
    flex: 1,
  },
});
