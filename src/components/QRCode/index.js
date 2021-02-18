import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
    Icons,
    registerUrl,
    Colors,
    Fonts,
    languageArray, registerUrlStage,
} from '../../constants';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  setAppLanguage,
  translate,
} from '../../redux/reducers/languageReducer';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {staging} from '../../helpers/api'
class QRCodeClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referralCode: '',
    };
  }

  componentDidMount() {
    let tmpReferralCode = this.props.userData.referral_link;
    const arrLink = tmpReferralCode.split('/');
    if (arrLink.length > 0) {
      this.setState({referralCode: arrLink[arrLink.length - 1]});
    }
  }

  closeModal() {
    console.log('closeModal');
    this.props.closeModal();
  }

  render() {
    const {modalVisible, userData} = this.props;

    return modalVisible ? (
      <View style={styles.mainContainer}>
        <View style={styles.subCont} />

        <View
          style={{
            width: '80%',
            marginTop: Dimensions.get('window').height / 3,
          }}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.5, y: 0.2}}
            locations={[0.1, 0.6, 1]}
            colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
            style={styles.lgVw}>
            <Text style={styles.qrTxt}>
              {translate('pages.setting.QRCode')}
            </Text>
            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={styles.touchCross}
              onPress={() => this.closeModal()}>
              <FontAwesome5 name="times" color={Colors.white} size={15} />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.vwQr}>
            <View style={{top: 27}}>
              <QRCode
                size={115}
                value={(staging ? registerUrlStage : registerUrl) + this.state.referralCode}
              />
            </View>
          </View>
        </View>
      </View>
    ) : null;
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  subCont: {
    position: 'absolute',
    backgroundColor: Colors.black,
    opacity: 0.5,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  lgVw: {
    height: 30,
    flexDirection: 'row',
  },
  qrTxt: {
    flex: 9,
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 14,
    marginStart: 10,
    alignSelf: 'center',
    fontWeight: '300',
  },
  touchCross: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vwQr: {
    height: 170,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});

QRCodeClass.propTypes = {
  modalVisible: PropTypes.bool,
  closeModal: PropTypes.func,
};

QRCodeClass.defaultProps = {
  modalVisible: false,
  closeModal: null,
};

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  setAppLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeClass);
