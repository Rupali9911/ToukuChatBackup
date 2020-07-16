import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Colors, Icons, languageArray} from '../constants';
import * as RNLocalize from 'react-native-localize';
import {
  setI18nConfig,
  setAppLanguage,
  userLanguage,
} from '../redux/reducers/languageReducer';

class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      languages: languageArray,
    };
    this.props.userLanguage().then((res) => {
      // console.log(JSON.stringify(res));
    });
  }

  async componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    await Promise.all(
      this.state.languages.map((item) => {
        if (
          this.props.selectedLanguageItem.language_name === item.language_name
        ) {
          this.props.setAppLanguage(item);
          setI18nConfig(item.language_name);
        }
      }),
    );
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig()
      .then(() => this.forceUpdate())
      .catch((error) => {
        console.error(error);
      });
  };

  onLanguageSelectPress = (item) => {
    this.props.setAppLanguage(item);
    setI18nConfig(item.language_name);
    this.setState((prevState) => {
      return {
        isChecked: !prevState.isChecked,
      };
    });
  };

  render() {
    const {isChecked, languages} = this.state;
    const {selectedLanguageItem} = this.props;
    if (isChecked) {
      return (
          <TouchableOpacity activeOpacity={1} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, position: 'absolute', left: 0, right: 10,}}
          onPress={() => this.setState({isChecked: false})}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.checkedIconContainer}
            onPress={() => this.onLanguageSelectPress(selectedLanguageItem)}>
            <Image
              source={selectedLanguageItem.icon}
              style={styles.iconStyle}
            />
          </TouchableOpacity>

          {languages.map((item, key) => (
            <View key={key}>
              {selectedLanguageItem.language_name ===
              item.language_name ? null : (
                <TouchableOpacity
                  style={styles.checkedIconContainer}
                  onPress={() => this.onLanguageSelectPress(item)}>
                  <Image source={item.icon} style={styles.iconStyle} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
          </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={styles.uncheckedIconContainer}
        onPress={() => this.onLanguageSelectPress(selectedLanguageItem)}>
        <Image source={selectedLanguageItem.icon} style={styles.iconStyle} />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    right: 10,
    top: Platform.OS === 'ios' ? 10 : 40,
    overflow: 'hidden',
    display: 'flex',
  },
  checkedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0,
    borderColor: Colors.primary,
    marginBottom: 5,
  },
  uncheckedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.primary,
    margin: 6,
    position: 'absolute',
    right: 10,
    top: Platform.OS === 'ios' ? 10 : 40,
  },
  iconStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    resizeMode: 'contain',
  },
});

LanguageSelector.propTypes = {
  isChecked: PropTypes.bool,
  /**
   * Callbacks
   */
  onPress: PropTypes.func,
  onOtherLanguagePress: PropTypes.func,
};

LanguageSelector.defaultProps = {
  isChecked: false,
  onPress: null,
  onOtherLanguagePress: null,
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {
  setAppLanguage,
  userLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
