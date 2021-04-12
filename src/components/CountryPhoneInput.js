import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PhoneInput from 'react-native-phone-input';
import {connect} from 'react-redux';
import {Colors, Fonts} from '../constants';
import {setI18nConfig, translate} from '../redux/reducers/languageReducer';
import {globalStyles} from '../styles';

class CountryPhoneInput extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      isFocus: false,
      countryCode: null,
      number: '',
    };
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      countryCode: '+' + this.phone.getCountryCode(),
    });
    console.log('this.phone.getCountryCode()', this.phone.getCountryCode());
  }
  onSubmitEditing() {
    this.props.onSubmitEditing();
  }

  focus() {
    console.log('focus called');
    this.textInput.focus();
  }
  onFocus() {
    console.log('onFocus called');
    this.setState({isFocus: true});
  }
  onBlur() {
    console.log('onBlur called');
    this.setState({isFocus: false});
  }

  onChangeText = (text) => {
    if (text.length > 0) {
      this.setState({isFocus: true});
    } else {
      this.setState({isFocus: false});
    }
  };

  onChangePhoneNumber(number, countryCode) {
    console.log('Numbera nd Country Code', number, countryCode);
    this.onChangeText(number);

    // this.setState({countryCode: countryCode}, () => {
    //   this.props.onChangePhoneNumber(number, countryCode);
    // });

    if (number.includes(countryCode)) {
      let txt = number.replace(countryCode, '');
      txt = txt.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/, '');
      if (!txt.startsWith('0')) {
        this.setState({number: txt, countryCode: countryCode}, () => {
          this.props.onChangePhoneNumber(countryCode + txt, countryCode);
        });
      }
    }
  }

  onChangeNumber = (text) => {
    const {countryCode} = this.state;
    console.log('onChangeNumber', text);
    if (text.includes(countryCode)) {
      let txt = text.replace(countryCode, '');
      this.setState({number: txt, countryCode: countryCode}, () => {
        this.props.onChangePhoneNumber(countryCode + txt, countryCode);
      });
    }
    this.onChangeText(text);
  };

  onSelectCountry(tag) {
    this.setState({
      countryCode: '+' + this.phone.getCountryCode(),
    });
  }

  onPressConfirm = () => {
    // this.props.onPressConfirm();
  };

  render() {
    const {isFocus, countryCode, number} = this.state;
    const {loading, isUpdatePhone} = this.props;

    const phoneInputContainer = [
      styles.container,
      {
        borderColor: isFocus ? Colors.gradient_2 : 'transparent',
        borderWidth: isFocus ? 1 : 0,
      },
    ];
    // let placeholder = countryCode + ' Enter number here';
    return isUpdatePhone ? (
      <View style={[styles.container, styles.containerStyle]}>
        {number.length === 0 && (
          <Text
            disabled={true}
            selectable={false}
            style={styles.phoneNumberPlaceHolder}>
            {translate('pages.register.phoneNumberTextForPlaceholder')}
          </Text>
        )}

        <PhoneInput
          ref={(ref) => {
            this.phone = ref;
          }}
          onChangePhoneNumber={(num) =>
            this.onChangePhoneNumber(num, countryCode)
          }
          initialCountry={'jp'}
          onSelectCountry={(tag) => this.onSelectCountry(tag)}
          value={countryCode + number}
          style={styles.singleFlex}
          flagStyle={styles.flagStyle}
          autoFormat={true}
          offset={0}
          allowZeroAfterCountryCode={false}
          textProps={{
            placeholder: '',
            maxLength: 16,
            placeholderTextColor: 'white',
            opacity: 0.8,
          }}
          onPressConfirm={this.onPressConfirm.bind(this)}
          // textComponent={() => (
          //             <TextInput
          //                 keyboardType="phone-pad"
          //                 onChangeText={this.onChangeNumber.bind(this)}
          //                 placeholder= {placeholder}
          //                 value={countryCode + number}
          //                 color= 'white'
          //                 opacity={0.8}
          //             />
          // )}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          style={[styles.rightBtnContainer]}
          onPress={this.props.onClickSMS}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.5, y: 0.8}}
            locations={[0.1, 0.6, 1]}
            colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
            style={[styles.rightBtnSubContainer, styles.linearGradientStyle]}>
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={globalStyles.smallRegularText}>
                {this.props.rightBtnText}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={phoneInputContainer}>
        {number.length === 0 && (
          <Text
            disabled={true}
            selectable={false}
            style={styles.phoneNumberPlaceHolder}>
            {translate('pages.register.phoneNumberTextForPlaceholder')}
          </Text>
        )}

        <PhoneInput
          ref={(ref) => {
            this.phone = ref;
          }}
          onChangePhoneNumber={(num) =>
            this.onChangePhoneNumber(num, countryCode)
          }
          initialCountry={'jp'}
          onSelectCountry={(tag) => this.onSelectCountry(tag)}
          value={countryCode + number}
          style={styles.singleFlex}
          flagStyle={styles.phoneInputFlagStyle}
          textStyle={styles.phoneInputTextStyle}
          autoFormat={true}
          offset={0}
          allowZeroAfterCountryCode={false}
          textProps={{
            placeholder: '',
            maxLength: 16,
            placeholderTextColor: 'white',
            opacity: 0.8,
          }}
          onPressConfirm={this.onPressConfirm.bind(this)}
          // textComponent={() => (
          //             <TextInput
          //                 keyboardType="phone-pad"
          //                 onChangeText={this.onChangeNumber.bind(this)}
          //                 placeholder= {placeholder}
          //                 value={countryCode + number}
          //                 color= 'white'
          //                 opacity={0.8}
          //             />
          // )}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.rightBtnContainer}
          onPress={this.props.onClickSMS}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.5, y: 0.8}}
            locations={[0.1, 0.6, 1]}
            colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
            style={styles.rightBtnSubContainer}>
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={globalStyles.smallRegularText}>
                {this.props.rightBtnText}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 45,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingLeft: 15,
    marginBottom: 15,
  },
  inputStyle: {
    flex: 1,
    color: Colors.white,
    fontSize: 13,
    fontFamily: Fonts.light,
    marginHorizontal: 5,
  },
  iconTriangle: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  placeholderStyle: {
    fontSize: 12,
  },
  rightBtnContainer: {
    borderTopRightRadius: 45 / 2,
    borderBottomRightRadius: 45 / 2,
    backgroundColor: Colors.white,
    height: 45,
    flex: 0.35,
  },
  rightBtnSubContainer: {
    borderTopRightRadius: 45 / 2,
    borderBottomRightRadius: 45 / 2,
    backgroundColor: Colors.white,
    height: 45,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    borderRadius: 0,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 10,
  },
  phoneNumberPlaceHolder: {
    position: 'absolute',
    color: 'white',
    left: '32%',
    opacity: 0.8,
  },
  singleFlex: {
    flex: 1,
  },
  flagStyle: {
    height: 30,
    width: 30,
  },
  phoneInputFlagStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  phoneInputTextStyle: {
    color: 'white',
  },
  linearGradientStyle: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});

CountryPhoneInput.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  returnKeyType: PropTypes.string,
  keyboardType: PropTypes.string,
  maxLength: PropTypes.number,
  editable: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  isRightSideBtn: PropTypes.any,
  isLeftSideBtn: PropTypes.any,
  isIconRight: PropTypes.bool,
  iconRightUrl: PropTypes.any,
  /**
   * Callbacks
   */
  onSubmitEditing: PropTypes.func,
  onClearValue: PropTypes.func,
  onChangePhoneNumber: PropTypes.func,
  onClickSMS: PropTypes.func,
};
CountryPhoneInput.defaultProps = {
  onClearValue: () => null,
  onSubmitEditing: () => null,
  onChangePhoneNumber: () => null,
  onClickSMS: () => null,
  placeholder: '',
  returnKeyType: 'next',
  isRightSideBtn: false,
  isLeftSideBtn: false,
  isIconRight: false,
  loading: false,
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CountryPhoneInput);
