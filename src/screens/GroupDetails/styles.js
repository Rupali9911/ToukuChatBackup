import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
const {height} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    paddingBottom: 50,
  },
  imageContainer: {
    height: height * 0.13,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageView: {
    height: height * 0.1,
    width: height * 0.1,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderColor: '#fff',
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  editIcon: {
    height: 15,
    width: 15,
    tintColor: Colors.gradient_2,
    marginLeft: 7,
  },
  tabBar: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    // paddingBottom: 10,
  },
  tabItem: {
    marginHorizontal: 10,
    alignItems: 'center',
    paddingBottom: 5,
    paddingHorizontal: 30,
  },
  tabTitle: {
    fontSize: 13,
    color: Colors.gradient_2,
  },
  searchContainer: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
    borderRadius: 20,
    margin: 10,
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    borderColor: Colors.gray_dark,
  },
  inputStyle: {
    flex: 1,
    color: Colors.black,
    fontSize: 13,
    marginStart: 10,
    alignSelf: 'center',
    fontFamily: Fonts.light,
    paddingVertical: 0,
  },
  iconSearch: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  friendListContainer: {
    paddingHorizontal: 15,
  },
  itemContainer: {
    marginVertical: 5,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  gradientContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    borderBottomWidth: 4,
    borderBottomColor: Colors.gradient_2,
  },
  searchWrapper: {
    backgroundColor: Colors.gradient_3,
    justifyContent: 'center',
  },
  aboutContainer: {
    paddingLeft: 10,
  },
  groupContainer: {
    marginBottom: 10,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameStyle: {
    color: Colors.gradient_2,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  textStyle: {
    fontSize: 13,
    fontFamily: Fonts.light,
  },
  hyperlinkStyle: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
