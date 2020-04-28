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

// import {Colors, Fonts, Icons} from '../../constants';

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
    isError: PropTypes.any,
    isRightSideBtn: PropTypes.any,
    isLeftSideBtn: PropTypes.any,
    isIconRight: PropTypes.bool,
    iconRightUrl: PropTypes.any,
  };

  static defaultProps = {
    onChangeText: () => null,
    onClearValue: () => null,
    placeholder: 'Placeholder',
    returnKeyType: 'next',
    isError: false,
    isRightSideBtn: false,
    isLeftSideBtn: false,
    isIconRight: false,
    // iconRightUrl: Icons.icon_calendar,
  };

  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
      typeState: 'enabled',
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
    this.setState({typeState: 'active', isFocus: true});
  }

  onBlur() {
    this.setState({typeState: 'enabled', isFocus: false});
  }

  getBorderColor(typeState) {
    switch (typeState) {
      case 'enabled':
        if (this.props.isError) {
          return '#ccc';
        } else {
          return '#ccc';
        }

      case 'active':
        if (this.props.isError) {
          return '#ccc';
        } else {
          return '#ccc';
        }

      default:
        return '#ccc';
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
      isError,
      placeholderStyle,
      isRightSideBtn,
      isLeftSideBtn,
      selectedValue,
      onPickerValueChange,
      ...rest
    } = this.props;

    const {isFocus, typeState} = this.state;
    return (
      <View>
        {/* <Text style={styles.titleTxt}>{placeholder}</Text> */}
        <View
          style={[
            styles.container,
            // {borderColor: this.getBorderColor(typeState)},
          ]}>
          {isLeftSideBtn ? (
            <View>
              <Picker
                selectedValue={selectedValue}
                style={{width: 100}}
                mode="dropdown"
                onValueChange={onPickerValueChange}>
                <Picker.Item label="Java" value="india" />
                <Picker.Item label="JavaScript" value="canada" />
              </Picker>
            </View>
          ) : null}
          <TextInput
            {...rest}
            editable={editable}
            // style={styles.inputStyle}
            style={
              !value
                ? [styles.inputStyle, styles.placeholderStyle]
                : styles.inputStyle
            }
            placeholderTextColor="#ccc"
            placeholder={placeholder}
            onChangeText={onChangeText}
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
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.5, y: 0.8}}
              locations={[0.1, 0.6, 1]}
              colors={['#f68b6b', '#f27478', '#ef4f8f']}
              style={{
                borderTopRightRadius: 21,
                borderBottomRightRadius: 21,
                backgroundColor: '#fff',
                height: 42,
                flex: 0.2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 12}}>
                {this.props.rightBtnText}
              </Text>
            </LinearGradient>
          ) : null}
          {isError ? (
            <Image source={Icons.icon_circle_error} style={styles.iconStyle} />
          ) : (
            <View>
              {isFocus ? (
                <TouchableOpacity activeOpacity={0.8} onPress={onClearValue}>
                  <Image
                    source={Icons.icon_circle_cross}
                    style={styles.iconStyle}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 42,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.3)',
    // borderWidth: 1,
    // borderColor: '#ccc',
    // paddingHorizontal: 15,
    paddingLeft: 15,
    marginBottom: 15,
  },
  inputStyle: {
    flex: 0.8,
    color: '#ccc',
    fontSize: 18,
    // fontFamily: Fonts.regular,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  placeholderStyle: {
    fontSize: 12,
    // fontFamily: Fonts.regular,
  },
  titleTxt: {
    fontSize: 16,
    // fontFamily: Fonts.bold,
    color: '#ccc',
    margin: 5,
  },
});
