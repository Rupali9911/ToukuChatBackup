import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors, Icons, Fonts } from '../../constants';
import { globalStyles } from '../../styles';

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
          }}
        >
          <Image
            source={Icons.icon_camera_grad}
            style={chatInput.attachmentImage}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View style={chatInput.textInputContainer}>
          <TextInput
            style={chatInput.textInput}
            onChangeText={(message) => onChangeText(message)}
            value={value}
            placeholder={placeholder}
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
            style={chatInput.sandButtonImage}
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
    height: 50,
    backgroundColor: Colors.gradient_1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 5,
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
  },
  sendButoonContainer: {
    height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sandButtonImage: { height: '50%', width: '70%', tintColor: Colors.gray },
});
