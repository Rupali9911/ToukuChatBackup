import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import LanguageSelector from './LanguageSelector';
import {Icons, Colors} from '../constants';
import * as RNLocalize from 'react-native-localize';
import {setI18nConfig, setAppLanguage} from '../redux/reducers/languageReducer';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
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

  onLanguageSelectPress = () => {
    if (this.props.isChecked) {
      this.props.setAppLanguage('ja');
      setI18nConfig('ja');
    } else {
      this.props.setAppLanguage('en');
      setI18nConfig('en');
    }
    this.props.onLanguageSelectPress();
  };

  render() {
    const {isChecked, isIconLeft, title, onBackPress} = this.props;
    return (
      <View style={styles.container}>
        {isIconLeft ? (
          <TouchableOpacity onPress={onBackPress}>
            <Image source={Icons.icon_back} style={styles.backIcon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backIcon} />
        )}
        <View>
          <Text style={styles.titleTxt}>{title}</Text>
        </View>
        <LanguageSelector
          isChecked={isChecked}
          onPress={this.onLanguageSelectPress.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  titleTxt: {
    color: Colors.black,
    fontSize: 20,
  },
});

Header.propTypes = {
  isChecked: PropTypes.bool,
  isIconLeft: PropTypes.bool,
  title: PropTypes.string,

  /**
   * Callbacks
   */
  onBackPress: PropTypes.func,
  onLanguageSelectPress: PropTypes.func,
};

Header.defaultProps = {
  title: '',
  isChecked: false,
  isIconLeft: true,
  onBackPress: null,
  onLanguageSelectPress: null,
};

const mapStateToProps = (state) => {
  return {
    selectedLanguage: state.languageReducer.selectedLanguage,
  };
};

const mapDispatchToProps = {
  setAppLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
