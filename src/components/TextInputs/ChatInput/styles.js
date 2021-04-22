// Library imports
import {Dimensions, Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';
import {isIphoneX, normalize} from '../../../utils';

// Height of the current window
const {height} = Dimensions.get('window');

/**
 * StyleSheet for chat input component
 */
export default StyleSheet.create({
  messareAreaConatiner: {
    flex: 0.95,
    justifyContent: 'flex-end',
  },
  messareAreaScroll: {flexGrow: 1},
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chatInputContainer: {
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    // height: '100%',
    // flex: 1,
    minHeight: isIphoneX() || Platform.isPad ? 70 : 50,
    maxHeight: 200,
    // backgroundColor: '#FC94B8',
    flexDirection: 'row',
    // paddingHorizontal: 15,
    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: isIphoneX() || Platform.isPad ? 20 : 5,
    alignItems: 'flex-end',
    overflow: 'visible',
  },
  chatAttachmentContainer: {
    // height: isIphoneX() ? 40 : 30,
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 5,
  },
  chatAttachmentButton: {
    // height: '100%',
    width: '29%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  attachmentImage: {
    // height: '80%',
    width: '90%',
  },
  textInputContainer: {
    width: '60%',
    // height: '80%',s
    justifyContent: 'center',
  },
  textInput: {
    // height: '100%',
    borderWidth: 0.2,
    backgroundColor: Colors.white,
    minHeight: 35,
    borderRadius: 10,
    borderColor: Colors.gray,
    paddingHorizontal: 10,
    paddingTop:
      Platform.OS === 'ios' ? (isIphoneX() || Platform.isPad ? 10 : 10) : 0,
    paddingBottom: 0,
    fontSize: Platform.isPad ? normalize(5.5) : normalize(12),
    textAlignVertical: 'center',
    lineHeight: 15,
  },
  sendButoonContainer: {
    // height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  sandButtonImage: {
    // height: '50%',
    width: '65%',
    // tintColor: Colors.gray,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  textInputStyle: {
    borderWidth: 0.2,
    backgroundColor: Colors.white,
    minHeight: 35,
    borderRadius: 10,
    borderColor: Colors.gray,
    paddingHorizontal: 10,
    paddingTop:
      Platform.OS === 'ios' ? (isIphoneX() || Platform.isPad ? 10 : 10) : 0,
    paddingBottom: 0,
    fontSize: Platform.isPad ? normalize(5.5) : normalize(11),
    textAlignVertical: 'center',
    lineHeight: 15,
    width: '100%',
    color: '#000',
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
    width: '100%',
    // height: '100%',
  },
  mentionStyle: {
    fontWeight: '500',
    color: 'blue',
  },

  // Example styles
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
  rootContainer: {
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    minHeight: isIphoneX() || Platform.isPad ? 70 : 50,
    // height: this.newHeight,
    backgroundColor: Colors.white,
    overflow: 'visible',
  },
  sendContainer: {
    width: '10%',
  },
  sendActionContainer: {
    width: '100%',
  },
  textInputFocusedContainer: {
    width: '80%',
  },
  suggestedUserContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    borderWidth: 0.25,
    borderColor: 'gray',
    padding: 5,
  },
  suggestedUserItemActionContainer: {
    height: normalize(22),
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 5,
  },
});
