import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors, Icons, Fonts } from '../../constants';
import { isIphoneX } from '../../utils';
const { height } = Dimensions.get('window');

export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    } = this.props;
    return (
      <View style={chatInput.chatInputContainer}>
        <View style={chatInput.chatAttachmentContainer}>
          <TouchableOpacity
            style={chatInput.chatAttachmentButton}
            onPress={() => {
              onAttachmentPress();
            }}
          >
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
            }}
          >
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
            }}
          >
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
            value={value}
            placeholder={placeholder}
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity
          style={chatInput.sendButoonContainer}
          onPress={() => {
            onSend();
          }}
        >
          <Image
            source={Icons.icon_send_button}
            style={[
              chatInput.sandButtonImage,
              value != 0 && { tintColor: null },
            ]}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const chatInput = StyleSheet.create({
  messareAreaConatiner: {
    flex: 0.95,
    justifyContent: 'flex-end',
  },
  messareAreaScroll: { flexGrow: 1 },
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chatInputContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: isIphoneX() ? 70 : 50,
    backgroundColor: '#FC94B8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: isIphoneX() ? 20 : 5,
  },
  chatAttachmentContainer: {
    height: '100%',
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAttachmentButton: {
    height: '100%',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentImage: {
    height: '80%',
    width: '90%',
  },
  textInputContainer: {
    width: '60%',
    height: '80%',
    justifyContent: 'center',
  },
  textInput: {
    height: '100%',
    borderWidth: 0.2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderColor: Colors.gray,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? (isIphoneX() ? 10 : 5) : 0,
    paddingBottom: 0,
  },
  sendButoonContainer: {
    height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sandButtonImage: { height: '50%', width: '70%', tintColor: Colors.gray },
});
