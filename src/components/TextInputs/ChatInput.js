import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Colors, Icons, Fonts} from '../../constants';
import {isIphoneX} from '../../utils';

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
      onChangeText,
      onSend,
      value,
      placeholder,
    } = this.props;
    return (
      <View style={chatInput.chatInputContainer}>
        <TouchableOpacity
          style={chatInput.chatAttachmentContainer}
          onPress={() => {
            onAttachmentPress ? onAttachmentPress : null;
          }}>
          <Image
            source={Icons.icon_camera_grad}
            style={chatInput.attachmentImage}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
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
          }}>
          <Image
            source={Icons.icon_send_button}
            style={[chatInput.sandButtonImage, value != 0 && {tintColor: null}]}
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
  messareAreaScroll: {flexGrow: 1},
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
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentImage: {
    height: '80%',
    width: '90%',
  },
  textInputContainer: {
    width: '80%',
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
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    paddingBottom: 0,
  },
  sendButoonContainer: {
    height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sandButtonImage: {height: '50%', width: '70%', tintColor: Colors.gray},
});
