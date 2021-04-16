import {StyleSheet} from 'react-native';
import {Colors} from '../../constants';

export default StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
  },
  subContainer: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  checkedContainer: {
    zIndex: 100,
    overflow: 'hidden',
    paddingTop: 10,
    backgroundColor: Colors.white,
  },
  dropdownIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
});
