import {StyleSheet, Dimensions} from 'react-native';
import {Images, Colors, Icons, Fonts} from '../../constants';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    // flex: 1,
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
    marginLeft: 5,
  },
  tabBar: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-evenly',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray,
    // paddingBottom: 10,
  },
  tabItem: {
    marginHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 5,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomColor: Colors.gradient_2,
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_2,
  },
  contentContainer: {
    marginBottom: 10,
  },
  contentSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentText: {
    color: Colors.gradient_2,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  contentLabel: {
    fontSize: 13,
    fontFamily: Fonts.light,
  },
});
