import React, {Component} from 'react';
import {View, ImageBackground, ScrollView} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';

import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {Images, Icons, Colors} from '../../constants';
import SettingsItem from '../../components/SettingsItem';

class More extends Component {
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
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HomeHeader title={translate('common.settings')} />
          {/* <ScrollView>
            <Section />
            <SettingsItem
              icon={Icons.icon_more}
              title={translate('pages.xchat.addFriend')}
            />
            <SettingsItem
              icon={Icons.icon_more}
              title={translate('pages.xchat.createNewGroup')}
            />
            <SettingsItem
              icon={Icons.icon_more}
              title={translate('pages.xchat.createChannel')}
            />
            <Section />
            <SettingsItem
              icon={Icons.icon_more}
              title={translate('common.profile')}
            />
            <SettingsItem
              icon={Icons.icon_more}
              title={translate('pages.xchat.invitation')}
            />
            <SettingsItem
              icon={Icons.icon_more}
              title={translate('pages.xchat.toukuPoints')}
            />
            <SettingsItem
              icon={Icons.icon_more}
              title={translate('common.goToXana')}
            />
            <Section />
          </ScrollView> */}
        </View>
      </ImageBackground>
    );
  }
}

const Section = (props) => {
  return <View style={{height: 30, backgroundColor: Colors.home_header}} />;
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(More);
