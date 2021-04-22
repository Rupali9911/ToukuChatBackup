import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
    marginRight: 5,
  },
  singleFlex: {
    flex: 1,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  headerContainer: {
    marginLeft: 5,
    flexDirection: 'row',
  },
  username: {
    marginRight: 5,
    color: '#e26161',
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
  },
  date: {
    color: '#6c757dc7',
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
  },
  text: {
    color: Colors.black,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
    marginLeft: 5,
  },
  trashIconStyle: {
    marginLeft: 5,
  },
  footerContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    marginRight: 5,
  },
  likeByCountLabel: {
    color: Colors.black,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
  },
  likeUnlikeLabel: {
    color: Colors.textTitle_orange,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
    marginLeft: 10,
  },
});
