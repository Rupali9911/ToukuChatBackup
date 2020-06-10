import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Text, StyleSheet } from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import { createChannelStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import { Images, Icons, Colors, Fonts } from '../../constants';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';

class Timeline extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

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
          <HeaderWithBack
            isCentered
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.timeline')}
          />
          <KeyboardAwareScrollView
            contentContainerStyle={createChannelStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text
              style={{ fontFamily: Fonts.thin, fontSize: 12, marginTop: 20 }}
            >
              {translate('pages.xchat.noTimelineFound')}
            </Text>
          </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
