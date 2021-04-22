import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Colors, Icons} from '../../constants';
import {globalStyles} from '../../styles';
import styles from './styles';

export default class VerificationInputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
      showEyeIcon: true,
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
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
    this.props.onChangeText(text);
    if (text.length > 0) {
      this.setState({isFocus: true});
    } else {
      this.setState({isFocus: false});
    }
  };

  onHidePassword = (text) => {
    this.setState({showEyeIcon: !this.state.showEyeIcon});
  };

  renderInputStatus() {
    switch (this.props.status) {
      case 'normal':
        return <View />;
      case 'wrong':
        return (
          <View style={styles.inputStatusContaner}>
            <Image source={Icons.icon_close} style={globalStyles.iconStyle} />
          </View>
        );
      case 'right':
        return (
          <View style={styles.inputStatusContaner}>
            <Image source={Icons.icon_tick} style={globalStyles.iconStyle} />
          </View>
        );
    }
  }

  render() {
    const {
      placeholder,
      onChangeText,
      value,
      returnKeyType,
      editable,
      keyboardType,
      maxLength,
      secureTextEntry,
      onClearValue,
      placeholderStyle,
      isRightSideBtn,
      isLeftSideBtn,
      selectedValue,
      onPickerValueChange,
      status,
      height,
      numberOfLines,
      isSuggestions,
      rightBtnText,
      loading,
      isEyeIcon,
      ...rest
    } = this.props;

    const {isFocus, showEyeIcon} = this.state;
    return (
      <View
        style={
          isSuggestions
            ? [
                styles.container,
                {
                  height: height,
                  borderColor: isFocus ? Colors.gradient_2 : 'transparent',
                  borderWidth: isFocus ? 1 : 0,
                  marginBottom: 5,
                },
              ]
            : [
                styles.container,
                {
                  height: height,
                },
              ]
        }>
        {isLeftSideBtn ? (
          <TouchableOpacity style={styles.leftSideActionButtonContainer}>
            <Image
              source={Icons.icon_language_select}
              style={globalStyles.iconStyle}
            />
            <Image
              source={Icons.icon_triangle_down}
              style={styles.iconTriangle}
            />
          </TouchableOpacity>
        ) : null}
        <TextInput
          {...rest}
          editable={editable}
          style={
            !value
              ? [styles.inputStyle, styles.placeholderStyle]
              : styles.inputStyle
          }
          placeholderTextColor="#333"
          placeholder={placeholder}
          onChangeText={this.onChangeText.bind(this)}
          value={value}
          ref={(input) => (this.textInput = input)}
          onSubmitEditing={this.onSubmitEditing.bind(this)}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={
            isEyeIcon ? (showEyeIcon ? true : false) : secureTextEntry
          }
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          numberOfLines={numberOfLines}
          autoCapitalize={'none'}
          color={Colors.black}
        />
        {isRightSideBtn ? (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.rightBtnContainer}
            onPress={this.props.onPressConfirm}>
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
                  {rightBtnText}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View>{this.renderInputStatus()}</View>
        )}
        {isEyeIcon ? (
          <TouchableOpacity
            style={styles.eyeIconActionContainer}
            activeOpacity={0.8}
            onPress={this.onHidePassword.bind(this)}>
            <FontAwesome5
              name={showEyeIcon ? 'eye' : 'eye-slash'}
              size={15}
              color={Colors.white}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

VerificationInputField.propTypes = {
  height: PropTypes.number,
  numberOfLines: PropTypes.number,
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
  rightBtnText: PropTypes.string,
  loading: PropTypes.bool,
  status: PropTypes.oneOf(['normal', 'wrong', 'right']),
  iconRightUrl: PropTypes.any,
  /**
   * Callbacks
   */
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  onClearValue: PropTypes.func,
  isEyeIcon: PropTypes.bool,
};

VerificationInputField.defaultProps = {
  height: Platform.isPad ? 55 : 45,
  numberOfLines: 1,
  onChangeText: () => null,
  onClearValue: () => null,
  onSubmitEditing: () => null,
  placeholder: '',
  returnKeyType: 'next',
  rightBtnText: 'SMS',
  isRightSideBtn: false,
  isLeftSideBtn: false,
  isIconRight: false,
  loading: false,
  status: 'normal',
  isEyeIcon: false,
};
