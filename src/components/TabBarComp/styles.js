import {StyleSheet, Platform} from 'react-native';
import {isIphoneX} from '../../utils';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: isIphoneX() || Platform.isPad ? 85 : 60,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: !isIphoneX || Platform.isPad ? 'center' : null,
    alignItems: 'center',
    marginTop: 8,
  },
});
