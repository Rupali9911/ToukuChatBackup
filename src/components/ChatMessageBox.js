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

import { Colors, Icons, Fonts, Images } from '../constants';
import RoundedImage from './RoundedImage';
import { translate, setI18nConfig } from '../redux/reducers/languageReducer';

const { width, height } = Dimensions.get('window');
let borderRadius = 20;
export default class ChatMessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longPressMenu: false,
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

  render() {
    const { longPressMenu } = this.state;
    const { message, isUser, time, status } = this.props;
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
            <Menu
              contentStyle={{
                backgroundColor: Colors.gradient_3,
                opacity: 0.9,
              }}
              visible={longPressMenu}
              onDismiss={this._closeMenu}
              anchor={
                <View
                  style={styles.talkBubble}
                  // onLongPress={this._openMenu}
                >
                  <View style={{ marginLeft: 5 }}>
                    <View style={styles.talkBubbleAbsoluteLeft} />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        minHeight: 40,
                        backgroundColor: Colors.white,
                        borderRadius: borderRadius,
                        justifyContent: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                      }}
                      onLongPress={this._openMenu}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: Fonts.light,
                        }}
                      >
                        {message}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
            >
              <Menu.Item
                titleStyle={{ color: Colors.white }}
                icon={Icons.icon_camera}
                onPress={() => {
                  this._closeMenu();
                }}
                title={translate('common.translate')}
              />
              <Menu.Item
                titleStyle={{ color: Colors.white }}
                icon="desktop-mac"
                onPress={() => {
                  this._closeMenu();
                }}
                title={translate('common.reply')}
              />
              <Menu.Item
                titleStyle={{ color: Colors.white }}
                icon="pencil"
                onPress={() => {
                  this._closeMenu();
                }}
                title={translate('common.edit')}
              />
              <Menu.Item
                titleStyle={{ color: Colors.white }}
                icon="delete"
                onPress={() => {
                  this._closeMenu();
                }}
                title={translate('common.delete')}
              />
              <Menu.Item
                titleStyle={{ color: Colors.white }}
                icon="minus-circle"
                onPress={() => {
                  this._closeMenu();
                }}
                title={translate('common.unsend')}
              />
              <Menu.Item
                titleStyle={{ color: Colors.white }}
                icon="note"
                onPress={() => {
                  this._closeMenu();
                }}
                title={translate('common.copy')}
              />
            </Menu>
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
          <Menu
            contentStyle={{
              backgroundColor: Colors.gradient_3,
              opacity: 0.9,
            }}
            visible={longPressMenu}
            onDismiss={this._closeMenu}
            anchor={
              <View style={styles.talkBubble}>
                <View style={styles.talkBubbleAbsoluteRight} />
                <LinearGradient
                  colors={[
                    Colors.gradient_3,
                    Colors.gradient_2,
                    Colors.gradient_1,
                  ]}
                  style={{
                    minHeight: 40,
                    borderRadius: borderRadius,
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                  }}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onLongPress={this._openMenu}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: 'white', fontSize: 15 }}>
                      {message}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            }
          >
            <Menu.Item
              titleStyle={{ color: Colors.white }}
              icon={Icons.icon_camera}
              onPress={() => {
                this._closeMenu();
              }}
              title={translate('common.translate')}
            />
            <Menu.Item
              titleStyle={{ color: Colors.white }}
              icon="desktop-mac"
              onPress={() => {
                this._closeMenu();
              }}
              title={translate('common.reply')}
            />
            <Menu.Item
              titleStyle={{ color: Colors.white }}
              icon="pencil"
              onPress={() => {
                this._closeMenu();
              }}
              title={translate('common.edit')}
            />
            <Menu.Item
              titleStyle={{ color: Colors.white }}
              icon="delete"
              onPress={() => {
                this._closeMenu();
              }}
              title={translate('common.delete')}
            />
            <Menu.Item
              titleStyle={{ color: Colors.white }}
              icon="minus-circle"
              onPress={() => {
                this._closeMenu();
              }}
              title={translate('common.unsend')}
            />
            <Menu.Item
              titleStyle={{ color: Colors.white }}
              icon="note"
              onPress={() => {
                this._closeMenu();
              }}
              title={translate('common.copy')}
            />
          </Menu>
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
  talkBubble: {
    justifyContent: 'flex-end',
    marginVertical: 15,
  },
  talkBubbleAbsoluteRight: {
    width: 120,
    height: 60,
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderTopColor: 'transparent',
    borderTopWidth: 25,
    borderLeftWidth: 13,
    borderLeftColor: Colors.gradient_3,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
    right: -35,
    top: -65,
  },
  talkBubbleAbsoluteLeft: {
    width: 120,
    height: 60,
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderTopColor: 'transparent',
    borderTopWidth: 25,
    borderRightWidth: 13,
    borderRightColor: Colors.white,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '90deg' }],
    left: -35,
    top: -65,
  },
  statusText: {
    color: Colors.gradient_1,
    fontFamily: Fonts.light,
  },
});
