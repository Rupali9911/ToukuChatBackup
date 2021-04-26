import moment from 'moment';
import React, {Component} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {ListLoader} from '../../components/Loaders';
import {Colors, Icons, Images} from '../../constants';
import S3uploadService from '../../helpers/S3uploadService';
import {
  followChannel,
  setCurrentChannel,
} from '../../redux/reducers/channelReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {
  getAmazonExchangeHistory,
  getBtcExchangeHistory,
  getExchangeHistory,
} from '../../redux/reducers/userReducer';
import {globalStyles} from '../../styles';
import styles from './styles';

class ExchangeHistory extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      loading: false,
      amazonLoading: false,
      btcLoading: false,
      option: 1,
      allHistoryResponse: null,
      allHistory: [],
      amazonHistoryResponse: null,
      amazonHistory: [],
      btcHistoryResponse: null,
      btcHistory: [],
    };
    this.S3uploadService = new S3uploadService();
    this.isPressed = false;
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getAllExchangeHistory();
    this.getAmazonHistory();
    this.getBtcHistory();
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  getAllExchangeHistory = () => {
    this.setState({loading: true});
    this.props
      .getExchangeHistory()
      .then((res) => {
        console.log('res', res);
        this.setState({loading: false});
        if (res) {
          this.setState({
            allHistory: res.results || [],
            allHistoryResponse: res,
          });
        }
      })
      .catch((err) => {
        this.setState({loading: false});
        console.log('err', err);
      });
  };

  getAmazonHistory = () => {
    this.setState({amazonLoading: true});
    this.props
      .getAmazonExchangeHistory()
      .then((res) => {
        this.setState({amazonLoading: false});
        if (res) {
          this.setState({
            amazonHistory: res.results || [],
            amazonHistoryResponse: res,
          });
        }
      })
      .catch((err) => {
        this.setState({amazonLoading: false});
        console.log('err', err);
      });
  };

  getBtcHistory = () => {
    this.setState({btcLoading: true});
    this.props
      .getBtcExchangeHistory()
      .then((res) => {
        this.setState({btcLoading: false});
        if (res) {
          this.setState({
            btcHistory: res.results || [],
            btcHistoryResponse: res,
          });
        }
      })
      .catch((err) => {
        this.setState({btcLoading: false});
        console.log('err', err);
      });
  };

  exchangeTypeText = (type) => {
    if (type === 'AMAZON') {
      return translate('pages.adWall.amazonExchangeHistory');
    } else if (type === 'BTC') {
      return translate('pages.adWall.btcExchangeHistory');
    }
    return type;
  };

  render() {
    const {
      option,
      allHistory,
      amazonHistory,
      btcHistory,
      loading,
      amazonLoading,
      btcLoading,
    } = this.state;
    const listData =
      option === 1 ? allHistory : option === 2 ? amazonHistory : btcHistory;
    const listLoading =
      option === 1 ? loading : option === 2 ? amazonLoading : btcLoading;

    const selectedTextColor = '#ff00a3';
    const unselectedTextColor = '#0a1f44';

    return (
      <View style={[globalStyles.container, {backgroundColor: Colors.white}]}>
        <HeaderWithBack
          onBackPress={() => this.props.navigation.goBack()}
          title={translate('pages.adWall.exchangeHistory')}
          isCentered
        />
        <View style={styles.singleFlex}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.actionContainer}
              onPress={() => this.setState({option: 1})}>
              <Text
                style={[
                  {
                    color:
                      option === 1 ? selectedTextColor : unselectedTextColor,
                  },
                  styles.actionText,
                ]}>
                {translate('pages.adWall.allExchangeHistory')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionContainer}
              onPress={() => this.setState({option: 2})}>
              <Text
                style={[
                  {
                    color:
                      option === 2 ? selectedTextColor : unselectedTextColor,
                  },
                  styles.actionText,
                ]}>
                {translate('pages.adWall.amazonExchangeHistory')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionContainer}
              onPress={() => this.setState({option: 3})}>
              <Text
                style={[
                  {
                    color:
                      option === 3 ? selectedTextColor : unselectedTextColor,
                  },
                  styles.actionText,
                ]}>
                {translate('pages.adWall.btcExchangeHistory')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listContainer}>
            {listLoading ? (
              <ListLoader />
            ) : listData.length > 0 ? (
              <FlatList
                keyExtractor={(_, index) => index.toString()}
                data={listData}
                renderItem={({item}) => {
                  let amount = Math.round(item.amount);
                  return (
                    <View style={styles.itemContainer}>
                      <Image
                        source={
                          item.exchange_type === 'AMAZON'
                            ? Images.amazon_img
                            : Images.bitcoin_img
                        }
                      />
                      <View style={styles.statusContainer}>
                        <Text style={styles.exchanceType}>
                          {this.exchangeTypeText(item.exchange_type)}
                        </Text>
                        <Text>
                          {moment(item.updated).format('YYYY.MM.DD, HH:mm')}
                        </Text>
                        <View style={styles.statusContentContainer}>
                          <Text style={styles.statusText}>Status: </Text>
                          <Text style={styles.singleFlex}>
                            {item.status !== 'PENDING'
                              ? item.status
                              : translate('pages.adWall.processing')}{' '}
                            {translate('pages.adWall.processingDetail')}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.amountContainer}>
                        <Text style={styles.itemAmountType}>
                          {item.amount_type}
                          <Text style={styles.amountType}>{amount}</Text>
                        </Text>
                        <Image
                          source={Icons.icon_drop_down}
                          style={styles.dropdownIcon}
                        />
                        <Text style={styles.currencyText}>
                          ¥<Text style={styles.amountText}>{amount}</Text>
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            ) : (
              <View style={styles.noExchageHistoryContainer}>
                <Text style={styles.noExchageHistoryText}>
                  {translate('pages.adWall.noExchageHistory')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    userFriends: state.friendReducer.userFriends,
    friendLoading: state.friendReducer.loading,
    groupLoading: state.groupReducer.loading,
    followingChannels: state.channelReducer.followingChannels,
  };
};

const mapDispatchToProps = {
  followChannel,
  setCurrentChannel,
  getExchangeHistory,
  getAmazonExchangeHistory,
  getBtcExchangeHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeHistory);
