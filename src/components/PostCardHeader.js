import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import { Colors, Fonts, Icons } from '../constants';
import { translate } from '../redux/reducers/languageReducer';
import Button from './Button';
import RoundedImage from './RoundedImage';
import moment from 'moment';
import { Menu, Divider } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export default class PostCardHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });
  render() {
    const { post, menuItems } = this.props;
    return (
      <View
        style={{
          height: height * 0.07,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: '4%',
        }}
      >
        <View style={{ justifyContent: 'center' }}>
          <RoundedImage
            source={post.channel_picture_thumb}
            isRounded={false}
            size={35}
          />
        </View>
        <View
          style={{
            height: 35,
            marginHorizontal: 5,
            flex: 1,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.regular,
              color: Colors.black,
            }}
          >
            {post.channel_name}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.extralight,
              color: Colors.gray_dark,
              fontSize: 12,
            }}
          >
            {moment(post.created).format('MM/DD')}
          </Text>
        </View>
        <View
          style={{
            height: 35,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            title={
              post.is_following
                ? translate('pages.xchat.following')
                : translate('pages.xchat.follow')
            }
            type={'primary'}
            height={'80%'}
          />

          <Menu
            style={{ marginTop: 30 }}
            visible={this.state.visible}
            onDismiss={this._closeMenu}
            anchor={
              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5,
                }}
                onPress={this._openMenu}
              >
                <Image
                  source={Icons.icon_dots}
                  style={{
                    tintColor: Colors.black_light,
                    height: 15,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            }
          >
            {menuItems &&
              menuItems.map((item, index) => {
                return (
                  <React.Fragment>
                    <Menu.Item
                      key={index}
                      onPress={() => {
                        this._closeMenu();
                      }}
                      title={`${item.title}`}
                      titleStyle={{
                        fontSize: 16,
                        fontWeight: '200',
                      }}
                    />
                    <Divider />
                  </React.Fragment>
                );
              })}
          </Menu>
        </View>
      </View>
    );
  }
}

PostCardHeader.propTypes = {
  value: PropTypes.object,
};

PostCardHeader.defaultProps = {
  value: {},
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    height: height * 0.06,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: Platform.OS === 'ios' ? 0.3 : 0.2,
    borderBottomColor: Colors.gray_dark,
  },
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_1,
    fontFamily: Fonts.regular,
  },
});