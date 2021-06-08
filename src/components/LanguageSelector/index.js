import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {connect} from 'react-redux';
import {languageArray} from '../../constants';
import {updateConfiguration} from '../../redux/reducers/configurationReducer';
import {
  setAppLanguage,
  setI18nConfig,
} from '../../redux/reducers/languageReducer';
import styles from './styles';

export const regionLanguage = RNLocalize.getLocales()
    .map((a) => a.languageCode)
    .values()
    .next().value;


class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      languages: languageArray,
    };
    // this.props.userLanguage().then((res) => {
    //   // console.log(JSON.stringify(res));
    // });
  }

  async componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    console.log('LanguageSelector componentDidMount called')
      if (this.props.selectedLanguageItem.selected === false) {
          console.log('this.props.selectedLanguageItem.selected is', this.props.selectedLanguageItem.selected)
          await Promise.all(
              this.state.languages.map((item) => {
                  if (regionLanguage === item.language_name) {
                      this.props.setAppLanguage(item);
                      setI18nConfig(item.language_name);
                  }
              }),
          );
      }
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
    // if (this.state.isChecked){
    //     let data = {
    //         language: item.language_name
    //     }
    //     console.log('Data', data)
    //     this.props.updateConfiguration(data)
    // }
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
        <TouchableOpacity
          activeOpacity={1}
          style={styles.actionContainer}
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
  updateConfiguration,
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
