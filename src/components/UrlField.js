import React, { Component } from 'react';
import {
  Clipboard,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Icons, Fonts } from '../constants';
import { globalStyles } from '../styles';
import { setI18nConfig, translate } from '../redux/reducers/languageReducer';
import { connect } from 'react-redux';
import { showToast,normalize } from '../utils';

class UrlField extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      url: '',
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  copyCode(data) {
    Clipboard.setString(data);
    showToast(
      translate('pages.setting.referralLink'),
      translate('pages.setting.toastr.linkCopiedSuccessfully'),
      'positive',
    );
  }

  render() {
    const { isFocus, countryCode, number } = this.state;
    const { value, onPressConfirm, loading, isUpdatePhone, url } = this.props;
    return (
        <View
            style={[
                styles.url_container,
                {
                    borderColor: Colors.gradient_2,
                    borderWidth: 1,
                }
            ]}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingRight: 10 }}
                horizontal
                showsHorizontalScrollIndicator={false}>
                <Text selectable={true} numberOfLines={1}
                    style={{ fontSize: normalize(12) }}>{url}</Text>
            </ScrollView>
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.rightBtnContainer}
                onPress={()=>{
                    this.copyCode(url)
                }}>
                <LinearGradient
                    start={{ x: 0.1, y: 0.7 }}
                    end={{ x: 0.5, y: 0.8 }}
                    locations={[0.1, 0.6, 1]}
                    colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
                    style={styles.rightBtnSubContainer}>
                    {loading ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                            <Text style={styles.smallRegularText}>
                                {translate('common.copy')}
                            </Text>
                        )}
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    rightBtnContainer: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: Colors.white,
        height: 45,
        flex: 0.25,
    },
    rightBtnSubContainer: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: Colors.white,
        height: 45,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    url_container: {
        flexDirection: 'row',
        height: 45,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingLeft: 10,
        marginBottom: 5,
        marginTop: 10
    },
    smallRegularText: {
        fontSize: normalize(12),
        fontFamily: Fonts.regular,
        color: Colors.white,
        textAlign: 'center',
    },
});

UrlField.propTypes = {
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

UrlField.defaultProps = {
  onClickCopy: () => null,
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

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(UrlField);
