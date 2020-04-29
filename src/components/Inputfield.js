import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Picker,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants';

export default class InputText extends Component {
  static propTypes = {
    value: PropTypes.any,
    onChangeText: PropTypes.func,
    onClearValue: PropTypes.func,
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
    onSubmitEditing: PropTypes.func,
  };

  static defaultProps = {
    onChangeText: () => null,
    onClearValue: () => null,
    onSubmitEditing: () => null,
    placeholder: 'Placeholder',
    returnKeyType: 'next',
    isRightSideBtn: false,
    isLeftSideBtn: false,
    isIconRight: false,
  };

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

  onFocus() {}

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
      ...rest
    } = this.props;

    const {isFocus} = this.state;
    return (
      <View
        style={[
          styles.container,
          {
            borderColor: isFocus ? Colors.gradient_2 : 'transparent',
            borderWidth: isFocus ? 1 : 0,
          },
        ]}>
        {isLeftSideBtn ? (
          <View>
            <Picker
              selectedValue={selectedValue}
              style={{width: 100}}
              // mode="dropdown"
              onValueChange={onPickerValueChange}>
              <Picker.Item label="India" value="india" />
              <Picker.Item label="Canada" value="canada" />
            </Picker>
          </View>
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
        />
        {isRightSideBtn ? (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.rightBtnContainer}>
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.5, y: 0.8}}
              locations={[0.1, 0.6, 1]}
              colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
              style={styles.rightBtnSubContainer}>
              <Text style={{color: 'white', fontSize: 12}}>
                {this.props.rightBtnText}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}

        {/* <View>
              {isFocus ? (
                <TouchableOpacity activeOpacity={0.8} onPress={onClearValue}>
                  <Image
                    source={Icons.icon_circle_cross}
                    style={styles.iconStyle}
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
    fontSize: 16,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  placeholderStyle: {
    fontSize: 12,
  },
  titleTxt: {
    fontSize: 16,
    color: '#ccc',
    margin: 5,
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
