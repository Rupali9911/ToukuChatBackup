import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Clipboard,
  ImageBackground
} from 'react-native';
import PropTypes from 'prop-types';

import {Colors, Fonts, Images, Icons} from '../constants';
import {translate} from '../redux/reducers/languageReducer';
import Button from './Button';
import RoundedImage from './RoundedImage';
import moment from 'moment';
import {Divider} from 'react-native-paper';
import {connect} from 'react-redux';
import Menu from '../components/Menu/Menu';
import MenuItem from '../components/Menu/MenuItem';
import LinearGradient from 'react-native-linear-gradient';
import {globalStyles} from '../styles';
import {getImage,showToast, normalize,} from '../utils';
import NavigationService from '../navigation/NavigationService';
import {isEqual} from 'lodash';

const {width, height} = Dimensions.get('window');

class PostChannelRankItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      audioPlayingId: null,
      perviousPlayingAudioId: null,
      readMore: false,
      character: 40,
    };
  }

  _openMenu = () => this.setState({visible: true});

  _closeMenu = () => this.setState({visible: false});

  toggleNumberOfLines = (check) => {
    if (check === 'less') {
      this.setState({readMore: false});
    } else {
      this.setState({readMore: true});
    }
  };

  copyCode(data) {
    Clipboard.setString(data);
    showToast(
      translate('pages.setting.referralLink'),
      translate('pages.setting.toastr.linkCopiedSuccessfully'),
      'positive',
    );
  }

  renderChannelDetail = () => {
    const {post, userData} = this.props;
    let tmpReferralCode = userData.referral_link;
    const arrLink = tmpReferralCode.split('/');
    let referralCode = '';
    if (arrLink.length > 0) {
      referralCode = arrLink[arrLink.length - 1];
    }
    const followCode = post.channel_id + referralCode + String(post.channel_id).length;
    
    const channelCountDetails = [
      {
        id: 1,
        title: 'posts',
        count: post.post || 0,
      },
      {
        id: 2,
        title: 'followers',
        count: post.members || 0,
      },
      {
        id: 3,
        title: 'vip',
        count: post.vip || 0,
      },
    ];

    return(
      <View style={{height: '100%', padding: 7, paddingTop: 15, backgroundColor: '#00000040'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {
              NavigationService.navigate('ChannelInfo', { channelItem: post, })
          }} style={{  }}>
            {post.channel_picture_thumb === null ||
              post.channel_picture_thumb === '' ||
              typeof post.channel_picture_thumb === undefined ? (
                <LinearGradient
                  start={{ x: 0.1, y: 0.7 }}
                  end={{ x: 0.5, y: 0.2 }}
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
                  size={55}
                />
              )}
            {/*<RoundedImage*/}
            {/*source={post.channel_picture_thumb}*/}
            {/*isRounded={false}*/}
            {/*size={35}*/}
            {/*/>*/}
          </TouchableOpacity>
          <View style={{flex:1, marginLeft: 10}}>
            <Text style={{ color: Colors.white }}>{post.channel_name}</Text>
            <Text style={{ color: Colors.white }}>{post.channel_status || "-"}</Text>
            <View
              style={{flexDirection: 'row', flex:1, }}
            >
              <Text
                style={[
                  { color: Colors.white },
                ]}>
                {translate('pages.invitation.referralOneField3')+" "}
                <Text
                  style={[
                    { marginLeft: 5, color: Colors.white, textDecorationLine: 'underline' },
                  ]}
                  onPress={() => this.copyCode(followCode)}>
                  {followCode}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.channelInfoDetail}>
          <View style={styles.channelDetailStatus}>
            {channelCountDetails.map((item, index) => {
              return (
                <View
                  key={index}
                  style={styles.detailStatusItem}>
                  <Text
                    style={styles.detailStatusItemCount}>
                    {item.count}
                  </Text>
                  <Text
                    style={styles.detailStatusItemName}>
                    {translate(`pages.xchat.${item.title}`)}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.channelDetailButton}>
            <Button
              title={
                post.is_following
                  ? translate('pages.xchat.unfollow')
                  : translate('pages.xchat.follow')
              }
              type={'transparent'}
              height={28}
              onPress={() => this.onFollowUnfollow()}
              loading={this.isFollowing}
              fontType={'normalRegular15Text'}
              borderColor={Colors.gradient_3}
            />
          </View>
        </View>
      </View>
    );
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   console.log('shouldComponentUpdate',!isEqual(nextProps,this.props));
  //   return !isEqual(nextProps,this.props);
  // }

  getCrownTintColor = (index) => {
    switch(index){
      case 0:
        return '#ffbf00';
      case 1:
        return '';
      case 2:
        return '#bd504a';
    }
  }

  render() {
    const {post, index, isChannelTimeline} = this.props;

    return (
      <View
        style={{
          backgroundColor: isChannelTimeline ? 'transparent' : Colors.white,
          marginVertical: 5,
          flex: 1,
          borderColor: '#dbdbdb',
          borderWidth: isChannelTimeline ? 1 : 0,
          paddingHorizontal: 5
        }}
        key={`${post.channel_id}`}>
        <View style={{ flexDirection: 'row' }}>
          <View style={[
            index <= 2 && {
              flex: 0.25,
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomColor: '#fb8ea1',
              borderBottomWidth: 3,
              borderWidth: 3,
              borderColor: Colors.white,
            },
            index > 2 && {
              flex: 0.25,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#fb8ea1',
              borderWidth: 3,
              backgroundColor: '#f57158fc'
            }]}>
            {index <= 2 ? <ImageBackground source={Images.crown_img} imageStyle={{ tintColor: this.getCrownTintColor(index) }} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} resizeMode={'contain'}>
              <Text style={{ fontSize: normalize(30), fontWeight: 'bold', color: Colors.white, marginTop: 30 }}>{index + 1}</Text>
            </ImageBackground> :
              <Text style={{ fontSize: normalize(30), fontWeight: 'bold', color: Colors.white }}>{index + 1}</Text>
            }

            {/* <Text style={{fontSize: normalize(15), fontWeight: 'bold'}}>{translate('pages.adWall.channelRank')}</Text>
          <Text style={{fontWeight: 'bold'}}>{translate('pages.adWall.channelRankText')}</Text> */}
          </View>
          <View style={{ flex: 0.75, marginLeft: 3 }}>
            <ImageBackground source={post.channel_cover_image ? { uri: post.channel_cover_image } : Images.channel_background}
              style={{ width: '100%', }}
              resizeMode={'cover'}>
              {this.renderChannelDetail()}
            </ImageBackground>
          </View>
        </View>
      </View>
    );
  }
}

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
  coverStyle: {
    width: '100%',
    height: 100,
  },
  squareImage: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelInfoDetail: {
    // flex: 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: '2%',
  },
  channelDetailStatus: {
    flex: 0.65,
    flexDirection: 'row',
    paddingHorizontal: '2%',
  },
  channelDetailButton: {
    flex: 0.35,
    paddingHorizontal: '1%',
    justifyContent: 'center',
  },
  detailStatusItem: {
    paddingTop: '5%',
    marginRight: '5%',
  },
  detailStatusItemCount: {
    alignSelf: 'center',
    color: Colors.white,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  detailStatusItemName: {
    alignSelf: 'center',
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
});

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(PostChannelRankItem);