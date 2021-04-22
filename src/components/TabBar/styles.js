import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: height * 0.08,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: Platform.OS === 'ios' ? 0.3 : 0.2,
    borderBottomColor: Colors.gray_dark,
  },
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: Platform.isPad ? normalize(10) : normalize(13),
    color: Colors.gradient_1,
    fontFamily: Fonts.regular,
  },
  itemActionContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.gradient_1,
  },
});
