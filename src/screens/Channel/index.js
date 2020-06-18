import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Text, StyleSheet } from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { channelStyles } from './styles';
import { globalStyles } from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import { Images, Icons, Colors, Fonts } from '../../constants';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';

class Channel extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };
  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  render() {
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HomeHeader title={translate('pages.xchat.channel')} />
          <View style={globalStyles.container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  fontFamily: Fonts.thin,
                  fontSize: 12,
                  marginTop: 20,
                  textAlign: 'center',
                }}
              >
                {translate('pages.xchat.noChannelFound')}
              </Text>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const createChannelStyles = StyleSheet.create({
  mainContainer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    channelLoading: state.channelReducer.loading,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
