// Library imports
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';

// Local imports
import {Colors, registerUrl, registerUrlStage} from '../../constants';
import {staging} from '../../helpers/api';
import {setAppLanguage, translate} from '../../redux/reducers/languageReducer';

// StyleSheet imports
import styles from './styles';

/**
 * QR code component
 */
class QRCodeClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referralCode: '',
    };
  }

  // Set referral code by processing it
  componentDidMount() {
    let tmpReferralCode = this.props.userData.referral_link;
    const arrLink = tmpReferralCode.split('/');
    if (arrLink.length > 0) {
      this.setState({referralCode: arrLink[arrLink.length - 1]});
    }
  }

  // When modal closes
  closeModal() {
    console.log('closeModal');
    this.props.closeModal();
  }

  render() {
    const {modalVisible} = this.props;
    return (
      modalVisible && (
        <View style={styles.mainContainer}>
          <View style={styles.subCont} />

          <View style={styles.modalContainer}>
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
              <View style={styles.qrCodeContainer}>
                <QRCode
                  size={115}
                  value={
                    (staging ? registerUrlStage : registerUrl) +
                    this.state.referralCode
                  }
                />
              </View>
            </View>
          </View>
        </View>
      )
    );
  }
}

/**
 * QR code component prop types
 */
QRCodeClass.propTypes = {
  modalVisible: PropTypes.bool,
  closeModal: PropTypes.func,
};

/**
 * QR code component default props
 */
QRCodeClass.defaultProps = {
  modalVisible: false,
  closeModal: null,
};

/**
 * @Redux - Map following state to props
 * @param {object} state - current state in stored in redux
 * @returns object
 */
const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {
  setAppLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeClass);
