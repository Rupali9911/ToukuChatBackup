import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import {Images, Icons} from '../../constants';
import BackHeader from '../../components/BackHeader';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';
import {forgotUserName} from '../../redux/reducers/forgotPassReducer';
import Toast from '../../components/Toast';
import DropDown from '../../components/DropDown';

class NeedSupport extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      title: '',
      description: '',
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  focusNextField(id) {
    this.inputs[id].focus();
  }

  render() {
    const {orientation, description, title} = this.state;

    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}>
            <BackHeader onBackPress={() => this.props.navigation.goBack()} />
            <View
              style={{
                flex: 1,
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
              }}>
              <Text
                style={[
                  globalStyles.bigSemiBoldText,
                  {
                    marginVertical: 50,
                    opacity: 0.8,
                  },
                ]}>
                {translate('pages.setting.createTicket')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: orientation != 'PORTRAIT' ? 0 : 50,
                }}>
                <Inputfield
                  value={title}
                  placeholder={translate('pages.setting.ticketTitle')}
                  onChangeText={(title) => this.setState({title})}
                  onSubmitEditing={() => {
                    this.focusNextField('description');
                  }}
                />
                <Inputfield
                  height={100}
                  numberOfLines={5}
                  onRef={(ref) => {
                    this.inputs['description'] = ref;
                  }}
                  value={description}
                  placeholder={translate('pages.setting.ticketDescription')}
                  onChangeText={(description) => this.setState({description})}
                  onSubmitEditing={() => {}}
                />

                <View
                  style={{
                    paddingBottom: 30,
                    zIndex: 100,
                    overflow: 'visible',
                  }}>
                  <DropDown />
                </View>
                <View style={{marginTop: 30, zIndex: 0, overflow: 'visible'}}>
                  <Button
                    type={'primary'}
                    title={translate('common.submit')}
                    //   onPress={() => this.onSubmitPress()}
                  />
                </View>
              </View>
            </View>
            <LanguageSelector />
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {
  forgotUserName,
};

export default connect(mapStateToProps, mapDispatchToProps)(NeedSupport);
