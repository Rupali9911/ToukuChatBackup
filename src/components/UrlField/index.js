import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Clipboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {Colors} from '../../constants';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {normalize, showToast} from '../../utils';
import styles from './styles';

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
    const {loading, url} = this.props;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.singleFlex}
          contentContainerStyle={styles.scrollViewContentContainer}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <Text
            selectable={true}
            numberOfLines={1}
            style={{fontSize: normalize(12)}}>
            {url}
          </Text>
        </ScrollView>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.rightBtnContainer}
          onPress={() => {
            this.copyCode(url);
          }}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.5, y: 0.8}}
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UrlField);
