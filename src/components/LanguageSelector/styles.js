import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Colors} from '../../constants';

export default StyleSheet.create({
  container: {
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    right: 10,
    top: Platform.OS === 'ios' ? 10 : 40,
    overflow: 'hidden',
    display: 'flex',
  },
  checkedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0,
    borderColor: Colors.primary,
    marginBottom: 5,
  },
  uncheckedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.primary,
    margin: 6,
    position: 'absolute',
    right: 10,
    top: Platform.OS === 'ios' ? 10 : 40,
  },
  iconStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    resizeMode: 'contain',
  },
  actionContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    left: 0,
    right: 10,
  },
});
