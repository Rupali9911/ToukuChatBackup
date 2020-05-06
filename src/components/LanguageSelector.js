import React, {Component} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
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
      selectedLanguage: this.props.selectedLanguage,
      languages: [
        {
          language_id: 1,
          language_name: 'en',
          selected: true,
        },

        {
          language_id: 2,
          language_name: 'ja',
          selected: false,
        },
      ],
    };
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    this.state.languages.map((item) => {
      if (item.selected == true) {
        this.setState({selectedLanguage: item.language_name});
        this.props.setAppLanguage(item.language_name);
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

  onLanguageSelectPress = (language) => {
    this.setState({selectedLanguage: language}, () => {
      this.props.setAppLanguage(language);
    });
    setI18nConfig(language);
    this.setState((prevState) => {
      return {
        isChecked: !prevState.isChecked,
      };
    });
  };

  render() {
    const {isChecked, selectedLanguage} = this.state;
    if (isChecked) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.checkedIconContainer}
            onPress={() => this.onLanguageSelectPress(selectedLanguage)}>
            <Image
              source={Icons.icon_language_select}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkedIconContainer}
            onPress={() => this.onLanguageSelectPress('en')}>
            <Image
              source={Icons.icon_language_select}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkedIconContainer}
            onPress={() => this.onLanguageSelectPress('ja')}>
            <Image
              source={Icons.icon_language_select}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={styles.uncheckedIconContainer}
        onPress={() => this.onLanguageSelectPress(selectedLanguage)}>
        <Image source={Icons.icon_language_select} style={styles.iconStyle} />
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
    top: 10,
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
    borderWidth: 0,
    borderColor: Colors.primary,
    margin: 6,
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'red',
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
    selectedLanguage: state.languageReducer.selectedLanguage,
  };
};

const mapDispatchToProps = {
  setAppLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
