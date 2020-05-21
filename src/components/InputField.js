import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Icons, Fonts} from '../constants';
import {globalStyles} from '../styles';

export default class InputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
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

  renderInputStatus() {
    switch (this.props.status) {
      case 'normal':
        return <View />;
      case 'wrong':
        return (
          <View style={{paddingEnd: 18}}>
            <Image source={Icons.icon_close} style={globalStyles.iconStyle} />
          </View>
        );
      case 'right':
        return (
          <View style={{paddingEnd: 18}}>
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
      ...rest
    } = this.props;

    const {isFocus} = this.state;
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
                  borderColor: isFocus ? Colors.gradient_2 : 'transparent',
                  borderWidth: isFocus ? 1 : 0,
                },
              ]
        }>
        {isLeftSideBtn ? (
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
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
          placeholderTextColor="#eeeeee"
          placeholder={placeholder}
          onChangeText={this.onChangeText.bind(this)}
          value={value}
          ref={(input) => (this.textInput = input)}
          onSubmitEditing={this.onSubmitEditing.bind(this)}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          numberOfLines={numberOfLines}
          autoCapitalize={'none'}
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

        {/* <View>
              {isFocus ? (
                <TouchableOpacity activeOpacity={0.8} onPress={onClearValue}>
                  <Image
                    source={Icons.icon_circle_cross}
                    style={globalStyles.iconStyle}
                  />
                </TouchableOpacity>
              ) : null}
            </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 45 / 2,
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
    flex: 0.3,
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

InputField.propTypes = {
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
};

InputField.defaultProps = {
  height: 45,
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
};
