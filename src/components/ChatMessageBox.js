import React, { Fragment, Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Menu, Divider } from 'react-native-paper';
import ChatMessageBubble from './ChatMessageBubble';

import { Colors, Icons, Fonts, Images } from '../constants';
import RoundedImage from './RoundedImage';
import { translate, setI18nConfig } from '../redux/reducers/languageReducer';
import { relativeTimeThreshold } from 'moment';

const { width, height } = Dimensions.get('window');
let borderRadius = 20;
export default class ChatMessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longPressMenu: false,
      selectedMessageId: null,
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  _openMenu = () => this.setState({ longPressMenu: true });

  _closeMenu = () => this.setState({ longPressMenu: false });

  layoutChange = (event) => {
    var { x, y, width, height } = event.nativeEvent.layout;
    borderRadius = height / 2;
    if (height > 40) {
      borderRadius = height / 2;
    }
  };

  onMessagePress = (id) => {
    console.log('ChatMessageBox -> onMessagePress -> id', id);
    this.setState({ selectedMessageId: id });
    this._openMenu();
  };

  render() {
    const { longPressMenu, selectedMessageId } = this.state;
    const { message, isUser, time, status, onMessageReply } = this.props;
    return !isUser ? (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'flex-start',
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginVertical: 5,
          }}
        >
          <RoundedImage
            source={Images.image_default_profile}
            size={50}
            resizeMode={'cover'}
          />
          <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
            <ChatMessageBubble
              message={message}
              isUser={isUser}
              onMessageReply={onMessageReply}
              onMessagePress={(id) => this.onMessagePress(id)}
              longPressMenu={longPressMenu}
              openMenu={this._openMenu}
              closeMenu={this._closeMenu}
              selectedMessageId={selectedMessageId}
            />
            <View
              style={{
                marginHorizontal: '1.5%',
                alignItems: 'center',
                marginVertical: 15,
              }}
            >
              <Text style={styles.statusText}>{status}</Text>
              <Text style={styles.statusText}>{time}</Text>
            </View>
          </View>
        </View>
      </View>
    ) : (
      <View
        style={[
          styles.container,
          {
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              marginHorizontal: '1.5%',
              alignItems: 'center',
              marginVertical: 15,
            }}
          >
            <Text style={styles.statusText}>{status}</Text>
            <Text style={styles.statusText}>{time}</Text>
          </View>
          <ChatMessageBubble
            message={message}
            isUser={isUser}
            onMessageReply={onMessageReply}
            onMessagePress={(id) => this.onMessagePress(id)}
            longPressMenu={longPressMenu}
            openMenu={this._openMenu}
            closeMenu={this._closeMenu}
            selectedMessageId={selectedMessageId}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '65%',
    paddingHorizontal: '3%',
  },
  statusText: {
    color: Colors.gradient_1,
    fontFamily: Fonts.light,
  },
});
