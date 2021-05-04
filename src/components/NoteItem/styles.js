import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

const {width,height} = Dimensions.get('window');

export default StyleSheet.create({
  textInput: {
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    backgroundColor: Colors.white,
    borderRadius: 7,
    borderColor: Colors.gray_dark,
    // marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    fontFamily: Fonts.light,
  },
  container: {
    borderWidth: 0.5,
    borderColor: Colors.light_gray,
    borderRadius: 3,
    padding: 10,
  },
  textInputStyle: {
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    backgroundColor: Colors.white,
    borderRadius: 7,
    borderColor: Colors.gray_dark,
    // marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    fontFamily: Fonts.light,
    width: '100%',
  },
  suggestedUserComponentImageStyle: {
    width: 20,
    height: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginRight: 5,
  },
  suggestedUserComponentStyle: {
    alignItems: 'center',
    paddingHorizontal: 10,
    height: height / 16,
    flexDirection: 'row',
  },
  mentionStyle: {
    fontWeight: '500',
    color: 'blue',
  },
  sendButtonStyle: {
    marginTop: 20,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 15,
  },
  exampleContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  exampleHeader: {
    fontWeight: '700',
  },
  contentContainer: {
    borderBottomColor: Colors.light_gray,
  },
  userContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
    marginRight: 5,
  },
  leftMargin: {
    marginLeft: 5,
  },
  rightMargin: {
    marginRight: 5,
  },
  topMargin: {
    marginTop: 5,
  },
  username: {
    marginRight: 5,
    color: '#e26161',
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
  },
  updatedDate: {
    color: '#6c757dc7',
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
  },
  itemText: {
    color: Colors.black,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interactionContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionText: {
    color: Colors.textTitle_orange,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
  },
  interactionIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  countText: {
    color: Colors.black,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(10),
  },
  commentIcon: {
    marginRight: 5,
    marginLeft: 5,
  },
  suggestedUsersComponentContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'absolute',
  },
  suggestedUsersScrollStyle: {
    marginBottom: 8,
    left: -2,
  },
  suggestedUsersActionContainer: {
    height: normalize(22),
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 5,
  },
  suggestedUsersContainer: {
    width: '100%',
    height: '100%',
  },
  dialogContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // flex: 0.5,
    marginTop: 10,
    height: 30,
    width: '100%',
  },
  commentButtonContainer: {
    marginHorizontal: 5,
    // width: 60,
  },
  loadCommentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  commentUpdateContainer: {
    borderBottomColor: Colors.black_light,
    // borderBottomWidth: 0.5,
    marginBottom: 10,
    paddingBottom: 2,
  },
  commentUpdateSubContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // flex: 0.5,
    marginTop: 10,
    height: 30,
    width: '100%',
  },
  viewSlider: {
    width: width - 50
  },  
  swipeMediaContainer: {
    justifyContent: 'center',
    width: width - 50,
    alignItems: 'center',
    height: 250,
  },
  swipeAudioContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: width - 50,
    padding: 10,
    alignItems: 'center',
    height: 250
  },
});
