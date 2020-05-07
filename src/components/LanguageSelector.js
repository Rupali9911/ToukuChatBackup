import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Colors, Icons} from '../constants';
import * as RNLocalize from 'react-native-localize';
import {setI18nConfig, setAppLanguage} from '../redux/reducers/languageReducer';

class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      languages: [
        {
          language_id: 1,
          language_name: 'en',
          icon: Icons.icon_flag_america,
          selected:
            this.props.selectedLanguageItem.language_name === 'en'
              ? true
              : false,
        },

        {
          language_id: 2,
          language_name: 'ja',
          icon: Icons.icon_flag_japan,
          selected:
            this.props.selectedLanguageItem.language_name === 'ja'
              ? true
              : false,
        },

        {
          language_id: 3,
          language_name: 'ch',
          icon: Icons.icon_flag_china,
          selected:
            this.props.selectedLanguageItem.language_name === 'ch'
              ? true
              : false,
        },

        {
          language_id: 4,
          language_name: 'tw',
          icon: Icons.icon_flag_taiwan,
          selected:
            this.props.selectedLanguageItem.language_name === 'tw'
              ? true
              : false,
        },

        {
          language_id: 5,
          language_name: 'ko',
          icon: Icons.icon_flag_korea,
          selected:
            this.props.selectedLanguageItem.language_name === 'ko'
              ? true
              : false,
        },
      ],
    };
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    this.state.languages.map((item) => {
      if (item.selected == true) {
        this.props.setAppLanguage(item);
        setI18nConfig(item.language_name);
      }
    });
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
            <View>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
