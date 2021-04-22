// Library imports
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {connect} from 'react-redux';

// Local imports
import bonusImage from '../../../../assets/images/bonus_bg.png';
import {closeBoxImage, Images, openBoxImage} from '../../../constants';
import {
  addNewSendMessage,
  assetXPValueOfChannel,
  checkLoginBonusOfChannel,
  deleteChannelMessage,
  deleteMultipleChannelMessage,
  editChannelMessage,
  getChannelConversations,
  getLocalFollowingChannels,
  getLoginBonusOfChannel,
  pinChannel,
  readAllChannelMessages,
  resetChannelConversation,
  selectLoginJackpotOfChannel,
  selectRegisterJackpot,
  sendChannelMessage,
  setChannelConversation,
  unpinChannel,
} from '../../../redux/reducers/channelReducer';
import {setCommonChatConversation} from '../../../redux/reducers/commonReducer';
import {
  translate,
  translateMessage,
} from '../../../redux/reducers/languageReducer';
import {normalize} from '../../../utils';

// Component imports
import ConfirmationModal from '../ConfirmationModal';
import UpdatePhoneModal from '../UpdatePhoneModal';

// StyleSheet import
import styles from './styles';

/**
 * Bonus modal component
 */
class BonusModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bonusModal: false,
      selectedKey: null,
      jackpotData: null,
      assetXPValue: null,
      loadingJackpot: false,
      showPhoneUpdateModal: false,
      isUpdatePhoneModalVisible: false,
    };
  }

  // Differentiate between login and daily jackot
  selectedLoginBonus = (key) => {
    this.setState({loadingJackpot: true});

    if (this.props.registerBonus) {
      this.props
        .selectRegisterJackpot({picked_option: key})
        .then((res) => {
          if (res) {
            console.log('register jackpotData', res);
            this.setState({jackpotData: res.data});
            this.getAssetXpValue();
            AsyncStorage.setItem('is_bonus_opened', 'true');
          }
          this.setState({loadingJackpot: false});
        })
        .catch((err) => {
          console.log('err', err);
          this.setState({loadingJackpot: false});
        });
    } else {
      this.props
        .selectLoginJackpotOfChannel({picked_option: key})
        .then((res) => {
          if (res) {
            console.log('jackpotData', res);
            this.setState({jackpotData: res.data});
            this.getAssetXpValue();
          }
          this.setState({loadingJackpot: false});
        })
        .catch((err) => {
          console.log('err', err);
          this.setState({loadingJackpot: false});
        });
    }
  };

  // Gets the XP Value
  getAssetXpValue = () => {
    this.props
      .assetXPValueOfChannel()
      .then((res) => {
        if (res) {
          console.log('asset_xp', res);
          if (res && res.data) {
            this.setState({assetXPValue: res.data});
          }
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // Check selected amount
  checkImageWithAmount = (amount) => {
    console.log('amount', amount);
    if (amount === 0) {
      return openBoxImage.open_box;
    } else if (amount >= 0 && amount <= 100) {
      return openBoxImage.less_gold;
    } else if (amount >= 100 && amount <= 1000) {
      return openBoxImage.mid_gold;
    } else if (amount >= 1000) {
      return openBoxImage.full_gold;
    }
  };

  // Gets the amount value
  getAmountValue = (jackpotData) => {
    let arr = [];
    if (jackpotData.picked_option === 1) {
      arr = [
        {
          amount: parseInt(jackpotData.picked_amount, 10),
          type: jackpotData.picked_amount_type || 'XP',
        },
        {
          amount: parseInt(jackpotData.missed1_amount, 10),
          type: jackpotData.missed1_amount_type || 'XP',
        },
        {
          amount: parseInt(jackpotData.missed2_amount, 10),
          type: jackpotData.missed2_amount_type || 'XP',
        },
      ];
    } else if (jackpotData.picked_option === 2) {
      arr = [
        {
          amount: parseInt(jackpotData.missed1_amount, 10),
          type: jackpotData.missed1_amount_type || 'XP',
        },
        {
          amount: parseInt(jackpotData.picked_amount, 10),
          type: jackpotData.picked_amount_type || 'XP',
        },
        {
          amount: parseInt(jackpotData.missed2_amount, 10),
          type: jackpotData.missed2_amount_type || 'XP',
        },
      ];
    } else if (jackpotData.picked_option === 3) {
      arr = [
        {
          amount: parseInt(jackpotData.missed1_amount, 10),
          type: jackpotData.missed1_amount_type || 'XP',
        },
        {
          amount: parseInt(jackpotData.missed2_amount, 10),
          type: jackpotData.missed2_amount_type || 'XP',
        },
        {
          amount: parseInt(jackpotData.picked_amount, 10),
          type: jackpotData.picked_amount_type || 'XP',
        },
      ];
    }
    return arr;
  };

  // Trigger modal to close
  onRequestClose = () => {
    this.props.onRequestClose();
  };

  // Trigger cancel when confirming phone number
  onCancel = () => {
    this.setState(
      {
        showPhoneUpdateModal: false,
      },
      () => {
        this.onRequestClose();
      },
    );
  };

  // Gets the hint text
  getHintText = () => {
    const {registerBonus} = this.props;
    const {jackpotData} = this.state;

    if (registerBonus) {
      return jackpotData
        ? `${translate('pages.adWall.bonusUseText1')}\n${translate(
            'pages.adWall.bonusUseText2',
          )}\n${translate('pages.adWall.bonusUseText3')}`
        : translate('pages.xchat.amazonGiftCardText');
    } else {
      return jackpotData
        ? `${translate('swal.xpusedForText')}`
        : `${translate('swal.extraCashWiningText')}\n${translate(
            'swal.xpusedForText',
          )}`;
    }
  };

  // Gets the assets value
  getAssetValue = () => {
    if (
      this.state.jackpotData &&
      this.state.jackpotData.picked_amount_type === 'TP'
    ) {
      let amount =
        this.props.userData.total_tp + this.state.jackpotData.picked_amount;
      return `${parseInt(amount, 10)}`;
    } else {
      return `${this.state.assetXPValue.XP}`;
    }
  };

  render() {
    const {visible, registerBonus} = this.props;
    //console.log('registerBonus', registerBonus, visible)
    const {
      showPhoneUpdateModal,
      orientation,
      isUpdatePhoneModalVisible,
    } = this.state;

    const selectedJackpotOneAmount = [
      styles.jackpotAmount,
      {
        color:
          this.state.jackpotData && this.state.jackpotData.picked_option === 1
            ? '#dbf875'
            : 'white',
      },
    ];

    const selectedJackpotTwoAmount = [
      {
        color:
          this.state.jackpotData && this.state.jackpotData.picked_option === 2
            ? '#dbf875'
            : 'white',
      },
      styles.jackpotAmount,
    ];

    const selectedJackpotThreeAmount = [
      {
        color:
          this.state.jackpotData && this.state.jackpotData.picked_option === 3
            ? '#dbf875'
            : 'white',
      },
      styles.jackpotAmount,
    ];

    const hintText = [
      {
        textAlign: registerBonus ? 'left' : 'center',
      },
      styles.hintText,
    ];

    return (
      <Modal
        visible={visible}
        transparent
        onRequestClose={this.onRequestClose.bind(this)}>
        <View style={styles.bonusModalContainer}>
          <SafeAreaView />
          <ImageBackground
            source={bonusImage}
            resizeMode={'cover'}
            style={styles.bonusBgContainer}>
            <View style={styles.singleFlezx}>
              <Text
                style={[styles.bonusTextHeading, {fontSize: normalize(20)}]}>
                {this.state.jackpotData
                  ? this.state.jackpotData.picked_amount > 0
                    ? translate('pages.xchat.congratulations')
                    : translate('pages.xchat.seeYouTomorrow')
                  : registerBonus
                  ? translate('pages.xchat.specialSignupBonus')
                  : translate('pages.xchat.loginBonusText')}
              </Text>
              {/* {registerBonus?null:<Text style={styles.bonusTitleText}>
                                {translate('pages.xchat.jackPot')}{' '}
                                <Text style={{fontSize: normalize(25), fontWeight: 'bold'}}>
                                    {bonusXP}
                                </Text>{' '}
                                <Text
                                    style={{fontSize: normalize(15), fontFamily: Fonts.regular, fontWeight: '300'}}>
                                    {'XP'}
                                </Text>
                            </Text>} */}
              {this.state.assetXPValue ? (
                <Text style={styles.bonusTitleText}>
                  {translate('pages.adWall.yourPoint')}{' '}
                  <Text style={styles.assetText}>{this.getAssetValue()}</Text>{' '}
                  <Text style={styles.chosenAmount}>
                    {this.state.jackpotData.picked_amount_type
                      ? this.state.jackpotData.picked_amount_type
                      : 'XP'}
                  </Text>
                </Text>
              ) : null}
              {this.state.loadingJackpot ? (
                <ActivityIndicator
                  style={styles.loading}
                  size={'large'}
                  color={'white'}
                />
              ) : (
                <View style={styles.bonusImageContainer}>
                  <TouchableOpacity
                    disabled={this.state.jackpotData}
                    onPress={() => {
                      this.selectedLoginBonus(1);
                    }}
                    style={styles.bonusImageActionContainer}>
                    <View style={styles.jackpotContainer}>
                      <Image
                        style={
                          this.state.jackpotData &&
                          this.state.jackpotData.picked_option === 1
                            ? styles.bonusImageZoom
                            : styles.bonusImage
                        }
                        source={{
                          uri: this.state.jackpotData
                            ? this.checkImageWithAmount(
                                this.getAmountValue(this.state.jackpotData)[0]
                                  .amount,
                              )
                            : closeBoxImage[0].value,
                        }}
                        resizeMode={'contain'}
                      />
                    </View>
                    {this.state.jackpotData && (
                      <View style={styles.jackpotAmountContainer}>
                        <Text style={selectedJackpotOneAmount}>
                          {this.getAmountValue(this.state.jackpotData)[0]
                            .amount + ''}
                          {' ' +
                            this.getAmountValue(this.state.jackpotData)[0].type}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={this.state.jackpotData}
                    onPress={() => {
                      this.selectedLoginBonus(2);
                    }}
                    style={styles.bonusImageActionContainer}>
                    <View style={styles.jackpotContainer}>
                      <Image
                        style={
                          this.state.jackpotData &&
                          this.state.jackpotData.picked_option === 2
                            ? styles.bonusImageZoom
                            : styles.bonusImage
                        }
                        source={{
                          uri: this.state.jackpotData
                            ? this.checkImageWithAmount(
                                this.getAmountValue(this.state.jackpotData)[1]
                                  .amount,
                              )
                            : closeBoxImage[1].value,
                        }}
                        resizeMode={'contain'}
                      />
                    </View>
                    {this.state.jackpotData ? (
                      <View style={styles.jackpotAmountContainer}>
                        <Text style={selectedJackpotTwoAmount}>
                          {this.getAmountValue(this.state.jackpotData)[1]
                            .amount + ''}
                          {' ' +
                            this.getAmountValue(this.state.jackpotData)[1].type}
                        </Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={this.state.jackpotData}
                    onPress={() => {
                      this.selectedLoginBonus(3);
                    }}
                    style={styles.bonusImageActionContainer}>
                    <View style={styles.jackpotContainer}>
                      <Image
                        style={
                          this.state.jackpotData &&
                          this.state.jackpotData.picked_option === 3
                            ? styles.bonusImageZoom
                            : styles.bonusImage
                        }
                        source={{
                          uri: this.state.jackpotData
                            ? this.checkImageWithAmount(
                                this.getAmountValue(this.state.jackpotData)[2]
                                  .amount,
                              )
                            : closeBoxImage[2].value,
                        }}
                        resizeMode={'contain'}
                      />
                    </View>
                    {this.state.jackpotData ? (
                      <View style={styles.jackpotAmountContainer}>
                        <Text style={selectedJackpotThreeAmount}>
                          {this.getAmountValue(this.state.jackpotData)[2]
                            .amount + ''}
                          {' ' +
                            this.getAmountValue(this.state.jackpotData)[2].type}
                        </Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {!this.state.jackpotData && registerBonus && (
              <Image
                style={styles.amazonGiftLogo}
                source={Images.amazon_gift_logo}
                resizeMode={'contain'}
              />
            )}
            <Text style={hintText}>{this.getHintText()}</Text>
            <TouchableOpacity
              style={{margin: normalize(15)}}
              onPress={() => {
                if (this.state.jackpotData && !this.props.userData.phone) {
                  this.setState({showPhoneUpdateModal: true});
                  return;
                }
                this.onRequestClose();
              }}>
              <Avatar.Icon
                size={50}
                icon={'close'}
                color={'white'}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </ImageBackground>
          <ConfirmationModal
            visible={showPhoneUpdateModal}
            onCancel={this.onCancel.bind(this)}
            onConfirm={() => {
              this.setState({showPhoneUpdateModal: false}, () => {
                setTimeout(() => {
                  this.setState({isUpdatePhoneModalVisible: true});
                }, 500);
              });
            }}
            orientation={orientation}
            confirmText={translate('swal.ok')}
            title={translate('swal.AuthenticateNumber')}
            message={translate('swal.NeedToAddPhoneNumber')}
          />
          <UpdatePhoneModal
            visible={isUpdatePhoneModalVisible}
            onRequestClose={() => {
              this.setState({isUpdatePhoneModalVisible: false});
              this.onRequestClose();
            }}
          />
        </View>
      </Modal>
    );
  }
}

/**
 * @Redux - Map following state to props
 * @param {object} state - current state in stored in redux
 * @returns object
 */
const mapStateToProps = (state) => {
  return {
    currentChannel: state.channelReducer.currentChannel,
    channelLoading: state.channelReducer.loading,
    userData: state.userReducer.userData,
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    chatConversation: state.channelReducer.chatConversation,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {
  getChannelConversations,
  readAllChannelMessages,
  sendChannelMessage,
  translateMessage,
  editChannelMessage,
  deleteChannelMessage,
  deleteMultipleChannelMessage,
  setChannelConversation,
  resetChannelConversation,
  addNewSendMessage,
  getLoginBonusOfChannel,
  checkLoginBonusOfChannel,
  selectLoginJackpotOfChannel,
  assetXPValueOfChannel,
  setCommonChatConversation,
  getLocalFollowingChannels,
  pinChannel,
  unpinChannel,
  selectRegisterJackpot,
};

export default connect(mapStateToProps, mapDispatchToProps)(BonusModal);
