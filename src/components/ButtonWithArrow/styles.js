import {StyleSheet} from 'react-native';
import {Colors} from '../../constants';
import {normalize} from '../../utils';

const menuItem = {
  height: normalize(24),
  backgroundColor: 'transparent',
  minWidth: '100%',
  borderWidth: 0,
};

export default StyleSheet.create({
  linearGradient: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  channelIcon: {
    flex: 0.1,
    height: 8,
    resizeMode: 'contain',
  },
  menuItemStyle: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
  },
  menuTitleStyle: {
    color: Colors.gradient_3,
    width: '100%',
    fontSize: normalize(12),
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  menuContentStyle: {
    borderRadius: 15,
    borderColor: Colors.gradient_3,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignSelf: 'flex-end',
    elevation: 0,
  },
  visibleAndBelow: {
    // borderWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  visibleAndNotBelow: {
    // borderWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: normalize(12),
  },
  menuItemBelow: {
    ...menuItem,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  menuItemNotBelow: {
    ...menuItem,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
});
