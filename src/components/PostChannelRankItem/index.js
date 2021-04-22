import React, {Component} from 'react';
import {
  Clipboard,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {Colors, Images} from '../../constants';
import NavigationService from '../../navigation/NavigationService';
import {
  followChannel,
  unfollowChannel,
} from '../../redux/reducers/channelReducer';
import {translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import {getImage, normalize, showToast} from '../../utils';
import {ConfirmationModal} from '../Modals';
import RoundedImage from '../RoundedImage';
import SecondaryButton from '../SecondaryButton';
import styles from './styles';

class PostChannelRankItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      visible: false,
      readMore: false,
      character: 40,
      showConfirmationModal: false,
    };
    this.isUnfollowing = false;
    this.isFollowing = false;
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

  onCancel = () => {
    this.toggleConfirmationModal();
  };

  onConfirm = async () => {
    const {post, onChannelUpdate, index} = this.props;

    if (this.isUnfollowing) {
      return;
    }
    this.isUnfollowing = true;
    await this.setState({
      isLoading: true,
    });
    let user = {
      user_id: this.props.userData.id,
    };
    this.props
      .unfollowChannel(post.channel_id, user)
      .then(async (res) => {
        console.log('res', res);

        if (res.status === true) {
          this.isUnfollowing = false;
          this.setState({
            isLoading: false,
          });
          onChannelUpdate(false, index);
          await this.toggleConfirmationModal();
        }
        return;
      })
      .catch((err) => {
        console.log('ChannelInfo -> onConfirm -> err', err);
        showToast('Touku', translate('common.somethingWentWrong'), 'primary');
        this.isUnfollowing = false;
        this.setState({
          isLoading: false,
        });
        this.toggleConfirmationModal();
      });
  };

  toggleConfirmationModal = () => {
    this.setState((prevState) => ({
      showConfirmationModal: !prevState.showConfirmationModal,
    }));
  };

  onFollowUnfollow = async () => {
    const {post, onChannelUpdate, index} = this.props;
    if (post.is_following) {
      this.setState({showConfirmationModal: true});
    } else {
      if (this.isFollowing) {
        return;
      }
      this.isFollowing = true;
      await this.setState({
        isLoading: true,
      });
      let data = {
        channel_id: post.channel_id,
        user_id: this.props.userData.id,
      };
      this.props
        .followChannel(data)
        .then((res) => {
          if (res.status === true) {
            showToast(
              post.channel_name,
              translate('pages.xchat.toastr.AddedToNewChannel'),
              'positive',
            );
            onChannelUpdate(true, index);
          }
          this.isFollowing = false;
          this.setState({
            isLoading: false,
          });
        })
        .catch((err) => {
          console.error('PostChannelRankItem::followChannel', err);
          showToast('Touku', translate('common.somethingWentWrong'), 'primary');
          this.isFollowing = false;
          this.setState({
            isLoading: false,
          });
        });
    }
  };

  renderChannelDetail = () => {
    const {post, userData} = this.props;
    let tmpReferralCode = userData.referral_link;
    const arrLink = tmpReferralCode.split('/');
    let referralCode = '';
    if (arrLink.length > 0) {
      referralCode = arrLink[arrLink.length - 1];
    }
    const followCode =
      post.channel_id + referralCode + String(post.channel_id).length;

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

    return (
      <View style={styles.channelDetailContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate('ChannelInfo', {channelItem: post});
            }}
            style={{}}>
            {post.channel_picture_thumb === null ||
            post.channel_picture_thumb === '' ||
            typeof post.channel_picture_thumb === undefined ? (
              <LinearGradient
                start={{x: 0.1, y: 0.7}}
                end={{x: 0.5, y: 0.2}}
                locations={[0.1, 0.6, 1]}
                colors={[
                  Colors.gradient_1,
                  Colors.gradient_2,
                  Colors.gradient_3,
                ]}
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
          <View style={styles.channelContentContainer}>
            <Text style={{color: Colors.white, fontSize: normalize(12)}}>
              {post.channel_name}
            </Text>
            <Text style={{color: Colors.white, fontSize: normalize(11)}}>
              {post.channel_status || '-'}
            </Text>
            <View style={styles.codeContainer}>
              <Text style={[{color: Colors.white, fontSize: normalize(11)}]}>
                {translate('pages.invitation.referralOneField3') + ' '}
                <Text
                  style={styles.followCode}
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
                <View key={index} style={styles.detailStatusItem}>
                  <Text style={styles.detailStatusItemCount}>{item.count}</Text>
                  <Text style={styles.detailStatusItemName}>
                    {translate(`pages.xchat.${item.title}`)}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.channelDetailButton}>
            <View style={styles.followButtonContainer}>
              <SecondaryButton
                title={
                  post.is_following
                    ? translate('pages.xchat.unfollow')
                    : translate('pages.xchat.follow')
                }
                type={'transparent'}
                height={normalize(22)}
                onPress={() => this.onFollowUnfollow()}
                loading={this.isFollowing}
                fontType={'normalRegular15Text'}
                fontSize={normalize(10)}
                borderColor={Colors.gradient_3}
                containerStyle={styles.followButtonContainerStyle}
              />
            </View>
          </View>
        </View>
        <View style={styles.followButtonContainer}>
          <SecondaryButton
            title={translate('pages.xchat.channelDetails')}
            type={'transparent'}
            height={normalize(22)}
            onPress={() =>
              NavigationService.navigate('ChannelInfo', {channelItem: post})
            }
            fontType={'normalRegular15Text'}
            fontSize={normalize(11)}
            borderColor={Colors.gradient_3}
            // containerStyle={{paddingHorizontal:0 }}
          />
        </View>
      </View>
    );
  };

  // shouldComponentUpdate(nextProps, nextState){
  //   console.log('shouldComponentUpdate',!isEqual(nextProps,this.props));
  //   return !isEqual(nextProps,this.props);
  // }

  getCrownTintColor = (index) => {
    switch (index) {
      case 0:
        return '#ffbf00';
      case 1:
        return '';
      case 2:
        return '#bd504a';
    }
  };

  render() {
    const {post, index, isChannelTimeline} = this.props;
    const {showConfirmationModal, orientation} = this.state;

    const container = [
      {
        backgroundColor: isChannelTimeline ? 'transparent' : Colors.white,
        borderWidth: isChannelTimeline ? 1 : 0,
      },
      styles.container,
    ];

    return (
      <View style={container}>
        <View style={styles.row}>
          <View
            style={[
              index <= 2 && styles.countContainerStyleOne,
              index > 2 && styles.countContainerStyleTwo,
            ]}>
            {index <= 2 ? (
              <ImageBackground
                source={Images.crown_img}
                imageStyle={{tintColor: this.getCrownTintColor(index)}}
                style={styles.countBackground}
                resizeMode={'contain'}>
                <Text style={styles.countText}>{index + 1}</Text>
              </ImageBackground>
            ) : (
              <Text style={styles.countTextWithoutBackground}>{index + 1}</Text>
            )}

            {/* <Text style={{fontSize: normalize(15), fontWeight: 'bold'}}>{translate('pages.adWall.channelRank')}</Text>
          <Text style={{fontWeight: 'bold'}}>{translate('pages.adWall.channelRankText')}</Text> */}
          </View>
          <View style={styles.channelCoverImageContainer}>
            <ImageBackground
              source={
                post.channel_cover_image
                  ? {uri: post.channel_cover_image}
                  : Images.channel_background
              }
              style={styles.channelCoverImage}
              resizeMode={'cover'}>
              {this.renderChannelDetail()}
            </ImageBackground>
          </View>
        </View>
        <ConfirmationModal
          visible={showConfirmationModal}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this)}
          orientation={orientation}
          isLoading={this.isUnfollowing}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toLeaveThisChannel')}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  unfollowChannel,
  followChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostChannelRankItem);
