import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';

import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';

class Chat extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  render() {
    const {orientation} = this.state;
    return (
      // <ImageBackground
      //   source={Images.image_touku_bg}
      //   style={globalStyles.container}>
      <View style={globalStyles.container}>
        <HomeHeader title={translate('pages.xchat.chat')} />
      </View>
      // </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
