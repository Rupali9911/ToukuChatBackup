// Library imports
import {StyleSheet, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

// Local imports
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

/**
 * StyleSheet for settings item
 */
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vwRight: {
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.dark_orange,
    padding: 7,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
  txtLanguage: {
    fontFamily: Fonts.light,
    color: Colors.dark_orange,
    fontSize: 13,
    fontWeight: '500',
  },
  txtInvitation: {
    fontFamily: Fonts.regular,
    color: Colors.black,
    fontSize: Platform.isPad ? normalize(6.5) : 13,
    fontWeight: '300',
    marginEnd: 10,
  },
  imgLang: {
    height: 8,
    width: 8,
  },
  txtDrpDwn: {
    backgroundColor: Colors.dark_orange,
    height: 30,
  },
  vwRightInv: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  conditionalImage: {
    width: Platform.isPad ? 25 : 20,
    height: Platform.isPad ? 25 : 20,
  },
  conditionalContainer: {
    width: 30,
  },
  title: {
    color: Colors.black,
    fontWeight: '300',
    marginLeft: Platform.isPad ? 25 : 0,
  },
  menuTitle: {
    color: 'white',
  },
  menuStyle: {
    marginTop: Platform.OS === 'ios' ? 23 : getStatusBarHeight() + 23,
  },
  menuContentStyle: {
    backgroundColor: 'transparent',
  },
  selectedLanguage: {
    width: 105,
  },
  copyIcon: {
    marginEnd: 10,
    height: Platform.isPad ? 20 : 13,
    width: Platform.isPad ? 20 : 13,
  },
  downloadIcon: {
    height: Platform.isPad ? 20 : 13,
    width: Platform.isPad ? 20 : 13,
  },
});
