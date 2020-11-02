import React, {Component} from 'react';
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

import {Colors, Fonts, Icons} from '../constants';
import {translate} from '../redux/reducers/languageReducer';
import Button from './Button';
import RoundedImage from './RoundedImage';
import moment from 'moment';
import {Menu, Divider} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {globalStyles} from '../styles';
import {getImage} from '../utils';

const {width, height} = Dimensions.get('window');

export default class PostCardHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  _openMenu = () => {
    this.setState({visible: true});
  };

  _closeMenu = () => {
    this.setState({visible: false});
  };

    getDate = (date) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const msgDate = new Date(date);
        if (today.getDate() === msgDate.getDate() &&
            today.getMonth() === msgDate.getMonth() &&
            today.getFullYear() === msgDate.getFullYear()) {
            //console.log('GroupListItem -> getDate -> date', date);
            return `${msgDate.getHours()}:${
                msgDate.getMinutes() < 10
                    ? '0' + msgDate.getMinutes()
                    : msgDate.getMinutes()
                }`;
        }
        if (
            yesterday.getDate() === msgDate.getDate() &&
            yesterday.getMonth() === msgDate.getMonth() &&
            yesterday.getFullYear() === msgDate.getFullYear()
        ){
            return translate('common.yesterday');
        }

        if(today.getFullYear() === msgDate.getFullYear()){
            return moment(date).format('MM/DD');
        }else{
            return moment(date).format('MM/DD/YY');
        }
    };

  render() {
    const {post, menuItems, isChannelTimeline} = this.props;
    return (
      <View
        style={{
          height: height * 0.07,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: '4%',
        }}>
        <View style={{justifyContent: 'center'}}>
          {post.channel_picture_thumb === null ||
          post.channel_picture_thumb === '' ||
          typeof post.channel_picture_thumb === undefined ? (
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.5, y: 0.2}}
              locations={[0.1, 0.6, 1]}
              colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
              style={styles.squareImage}>
              <Text style={globalStyles.normalRegularText}>
                {post.channel_name.charAt(0).toUpperCase()}
                {/* {secondUpperCase} */}
              </Text>
            </LinearGradient>
          ) : (
            <RoundedImage
              source={getImage(post.channel_picture_thumb)}
              isRounded={false}
              size={40}
            />
          )}
          {/*<RoundedImage*/}
          {/*source={post.channel_picture_thumb}*/}
          {/*isRounded={false}*/}
          {/*size={35}*/}
          {/*/>*/}
        </View>
        <View
          style={{
            height: 35,
            marginHorizontal: 5,
            flex: 1,
          }}>
          <Text
            style={{
              //fontFamily: Fonts.smallNunitoRegularText,
              color: Colors.black,
                fontSize: 15,
                fontFamily: Fonts.nunitoSansRegular,
            }}>
            {post.channel_name}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.extralight,
              color: Colors.gray_dark,
              fontSize: 13,
                marginTop: -5
            }}>
              {this.getDate(post.created)}
          </Text>
        </View>
        {isChannelTimeline ? null : (
          <View
            style={{
              height: 35,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View style={{width: 100}}>
              <Button
                title={
                  post.is_following
                    ? translate('pages.xchat.following')
                    : translate('pages.xchat.follow')
                }
                type={'primaryNew'}
                height={'85%'}
                fontType={'normalRegular15Text'}
              />
            </View>

            <Menu
              style={{marginTop: 30}}
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
                  onPress={this._openMenu}>
                  <Image
                    source={Icons.icon_dots}
                    style={{
                      tintColor: Colors.black_light,
                      height: 15,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              }>
              {menuItems &&
                menuItems.map((item, index) => {
                  return (
                    <React.Fragment>
                      <Menu.Item
                        key={index}
                        onPress={() => {
                          this._closeMenu();
                          item.onPress(post);
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
        )}
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
  squareImage: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
