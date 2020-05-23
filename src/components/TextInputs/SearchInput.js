import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Colors, Icons, Fonts} from '../../constants';
import {globalStyles} from '../../styles';

export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  // onSubmitEditing() {
  //     this.props.onSubmitEditing();
  // }

  focus() {
    this.textInput.focus();
  }

  onFocus() {}

  onBlur() {}

  render() {
    const {
      placeholder,
      onChangeText,
      isIconRight,
      onIconRightClick,
      onSubmitEditing,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Image source={Icons.icon_search} style={styles.iconSearch} />
          <TextInput
            style={styles.inputStyle}
            placeholder={placeholder || 'Search'}
            // placeholderTextColor={Colors.gray}
            onChangeText={onChangeText}
            ref={(input) => (this.textInput = input)}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={'done'}
            autoCorrect={false}
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            autoCapitalize={'none'}
            underlineColorAndroid={'transparent'}
          />
        </View>
        {!isIconRight ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconRightContainer}
            onPress={onIconRightClick}>
            <Image source={Icons.icon_edit_pen} style={styles.iconRight} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: Colors.home_header,
  },
  searchContainer: {
    height: Platform.OS === 'ios' ? 'auto' : 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
  },
  inputStyle: {
    flex: 1,
    // width: '100%',
    color: Colors.black,
    fontSize: 13,
    fontFamily: Fonts.light,
    marginStart: 10,
    alignSelf: 'center',
  },
  iconRight: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  iconSearch: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  iconRightContainer: {
    marginStart: 15,
    alignSelf: 'center',
  },
});
