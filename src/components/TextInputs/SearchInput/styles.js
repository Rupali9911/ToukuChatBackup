// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../../constants';
import {normalize} from '../../../utils';

/**
 * StyleSheet for search input component
 */
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginLeft: 10,
    // backgroundColor: Colors.home_header,
  },
  searchContainer: {
    height: Platform.OS === 'ios' ? (Platform.isPad ? 50 : 'auto') : 45,
    // height: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
  },
  inputStyle: {
    flex: 1,
    // width: '100%',
    color: Colors.black,
    fontSize: Platform.isPad ? normalize(8) : 16,
    fontFamily: Fonts.regular,
    marginStart: 10,
    //alignSelf: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    // fontWeight: '300',
  },
  iconRight: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  iconSearch: {
    width: Platform.isPad ? 20 : 15,
    height: Platform.isPad ? 20 : 15,
    resizeMode: 'contain',
    marginTop: 2,
    marginLeft: 5,
  },
  iconRightContainer: {
    marginStart: 15,
    alignSelf: 'center',
    width: 35,
  },

  buttonStyle: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderColor: '#fff',
  },
  buttonTextStyle: {
    fontFamily: Fonts.light,
    fontSize: 14,
    color: '#fff',
    fontWeight: '300',
  },
  deleteIcon: {height: 28, width: 28, tintColor: 'white'},
  menuStyle: {
    marginTop: 40,
  },
  removeActionContainer: {
    marginStart: -5,
    marginEnd: 5,
  },
  singleFlex: {
    flex: 1,
  },
  menu: {
    marginTop: 20,
    marginLeft: -40,
    shadowOffset: {width: 0.5, height: 0.5},
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
  menuItemTitle: {
    marginLeft: -25,
  },
  actionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionSubContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
