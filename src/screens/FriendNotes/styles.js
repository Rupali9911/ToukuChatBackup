import {StyleSheet, Dimensions} from 'react-native';
import {Images, Colors, Icons, Fonts} from '../../constants';
const {width, height} = Dimensions.get('window');

export const friendDetailStyles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    paddingBottom: 50,
  },
  imageContainer: {
    height: height * 0.18,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageView: {
    height: height * 0.13,
    width: height * 0.13,
    borderWidth: 3,
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
    marginTop: 10,
    justifyContent: 'space-evenly'
  },
  tabItem: {
    marginHorizontal: 10,
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  tabImage: {
    tintColor: Colors.gradient_2,
    marginVertical: 5,
    height: 30,
    width: 30,
  },
  tabTitle: {
    fontSize: 16,
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
});
