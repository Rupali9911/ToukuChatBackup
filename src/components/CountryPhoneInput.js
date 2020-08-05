import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Icons, Fonts} from '../constants';
import {globalStyles} from '../styles';
import {translate} from "../redux/reducers/languageReducer";
export default class CountryPhoneInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
      countryCode: null,
    };
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
    this.setState({
      countryCode: '+' + this.phone.getCountryCode(),
    });
    console.log('this.phone.getCountryCode()', this.phone.getCountryCode())
  }
  onSubmitEditing() {
    this.props.onSubmitEditing();
  }
  focus() {
    this.textInput.focus();
  }
  onFocus() {
    this.setState({isFocus: true});
  }
  onBlur() {
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

    console.log('Number and code', number, countryCode)
    this.onChangeText(number);

    this.setState({countryCode}, () => {
      this.props.onChangePhoneNumber(number, countryCode);
    });
  }

  onSelectCountry(tag) {
    this.setState({
      countryCode: '+' + this.phone.getCountryCode(),
    });
  }

  onPressConfirm = () => {
    // this.props.onPressConfirm();
  };

  render() {
    const {isFocus, countryCode} = this.state;
    const {value, onPressConfirm, loading} = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            borderColor: isFocus ? Colors.gradient_2 : 'transparent',
            borderWidth: isFocus ? 1 : 0,
          },
        ]}>
        <PhoneInput
          ref={(ref) => {
            this.phone = ref;
          }}
          onChangePhoneNumber={(number) =>
            this.onChangePhoneNumber(number, countryCode)
          }
          initialCountry={'jp'}
          onSelectCountry={(tag) => this.onSelectCountry(tag)}
          value={countryCode}
          style={{flex: 1}}
          flagStyle={{height: 30, width: 30, borderRadius: 15}}
          textStyle={{color: 'white'}}
          autoFormat={true}
          offset={0}
          textProps={{
            placeholder: '',
            maxLength: 13,
            placeholderTextColor: 'white',
            opacity: 0.8,
          }}
          onPressConfirm={this.onPressConfirm.bind(this)}
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
    flex: 0.25,
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
