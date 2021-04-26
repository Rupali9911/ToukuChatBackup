import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: Colors.home_header,
  },
  singleFlex: {
    flex: 1,
  },
  divider: {
    flex: 0.1,
  },
  titleContainer: {
    flex: 0.8,
    alignItems: 'center',
  },
  titleText: {
    fontWeight: '300',
    fontSize: Platform.isPad ? normalize(9.5) : 18,
    color: Colors.white,
  },
  contentSubContainer: {
    flex: 0.1,
    alignItems: 'flex-end',
  },
  menuStyle: {
    marginTop: 30,
  },
  upActionContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  upIcon: {
    width: 10,
    height: 7,
  },
  anotherUpIcon: {
    marginTop: 3,
    width: 10,
    height: 7,
    transform: [{rotate: '180deg'}],
  },
  menuItem: {
    height: 35,
    width: 200,
  },
  menuItemTitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    fontWeight: '300',
  },
});
