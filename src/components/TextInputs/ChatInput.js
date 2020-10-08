import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Colors, Icons, Fonts} from '../../constants';
import {isIphoneX} from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {t} from 'i18n-js';
const {height} = Dimensions.get('window');

export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.newHeight = isIphoneX() ? 70 : 50;
    this.lineHeight = 0;
    this.oldLineHeight = 0;
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  render() {
    const {
      onAttachmentPress,
      onCameraPress,
      onGalleryPress,
      onChangeText,
      onSend,
      value,
      placeholder,
      sendingImage,
      sendEnable,
    } = this.props;
    if (value.length === 0) {
      this.newHeight = isIphoneX() ? 70 : 50;
    }
    return (
      <View
        style={{
          // position: 'absolute',
          // bottom: 0,
          width: '100%',
          // minHeight: isIphoneX() ? 70 : 50,
          height: this.newHeight,
          // maxHeight: 200,
          backgroundColor: Colors.white,
        }}>
        <LinearGradient
          colors={['rgba(255, 137, 96, 0.3)', 'rgba(255, 98, 165, 0.3)']}
          // locations={[0.2, 1]}
          useAngle={true}
          // angle={270}
          angleCenter={{x: 0, y: 1}}
          style={[
            chatInput.chatInputContainer,
            {
              alignItems:
                this.newHeight == 70 || this.newHeight == 50
                  ? 'center'
                  : 'flex-end',
            },
          ]}>
          {/* <View style={chatInput.chatInputContainer}> */}
          <View style={chatInput.chatAttachmentContainer}>
            <TouchableOpacity
              style={chatInput.chatAttachmentButton}
              onPress={() => {
                onAttachmentPress();
              }}>
              {/* <FontAwesome5 name={'plus'} size={height * 0.03} color={'indigo'} /> */}
              <Image
                source={Icons.plus_icon_select}
                style={chatInput.attachmentImage}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={chatInput.chatAttachmentButton}
              onPress={() => {
                onCameraPress();
              }}>
              <Image
                source={Icons.icon_camera_grad}
                style={chatInput.attachmentImage}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={chatInput.chatAttachmentButton}
              onPress={() => {
                onGalleryPress();
              }}>
              <Image
                source={Icons.gallery_icon_select}
                style={chatInput.attachmentImage}
                resizeMode={'contain'}
              />
              {/* <FontAwesome5
              name={'image'}
              size={height * 0.03}
              color={'indigo'}
            /> */}
            </TouchableOpacity>
          </View>
          <View style={chatInput.textInputContainer}>
            <TextInput
              multiline={true}
              style={chatInput.textInput}
              onChangeText={(message) => onChangeText(message)}
              onContentSizeChange={({nativeEvent}) => {
                if (nativeEvent.contentSize.height != this.lineHeight) {
                  this.lineHeight = nativeEvent.contentSize.height;
                  if (
                    this.lineHeight > 20 &&
                    this.lineHeight > this.oldLineHeight &&
                    this.newHeight <= 200
                  ) {
                    this.newHeight = this.newHeight + 15;
                  }
                  if (
                    this.lineHeight > 20 &&
                    this.lineHeight < this.oldLineHeight
                  ) {
                    this.newHeight = this.newHeight - 15;
                  }
                  if (
                    isIphoneX() ? this.lineHeight <= 70 : this.lineHeight <= 50
                  ) {
                    this.newHeight = isIphoneX() ? 70 : 50;
                  }
                  this.oldLineHeight = this.lineHeight;
                }
              }}
              value={value}
              placeholder={placeholder}
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity
            style={chatInput.sendButoonContainer}
            activeOpacity={value || sendingImage.uri ? 0 : 1}
            onPress={() => {
              value || sendingImage.uri ? onSend() : null;
            }}>
            <Image
              source={Icons.icon_send_button}
              style={[
                chatInput.sandButtonImage,
                (value || sendingImage.uri) && {tintColor: null},
              ]}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/* </View> */}
        </LinearGradient>
      </View>
    );
  }
}

const chatInput = StyleSheet.create({
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
    height: '100%',
    // flex: 1,
    // minHeight: isIphoneX() ? 70 : 50,
    // maxHeight: 200,
    // backgroundColor: '#FC94B8',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: isIphoneX() ? 20 : 5,
  },
  chatAttachmentContainer: {
    // height: '100%',
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAttachmentButton: {
    // height: '100%',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentImage: {
    // height: '80%',
    width: '90%',
  },
  textInputContainer: {
    width: '60%',
    // height: '80%',
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
    paddingTop: Platform.OS === 'ios' ? (isIphoneX() ? 10 : 5) : 0,
    paddingBottom: 0,
    fontSize: 12,
    lineHeight: 15,
  },
  sendButoonContainer: {
    // height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  sandButtonImage: {
    // height: '50%',
    width: '70%',
    tintColor: Colors.gray,
  },
});
