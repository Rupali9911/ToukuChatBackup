import React, {Component} from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import DropDown from '../../components/DropDown';
import {BackHeader} from '../../components/Headers';
import Inputfield from '../../components/InputField';
import LanguageSelector from '../../components/LanguageSelector';
import {Images} from '../../constants';
import {forgotUserName} from '../../redux/reducers/forgotPassReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import styles from './styles';

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

  UNSAFE_componentWillMount() {
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

    const containerPadding = orientation !== 'PORTRAIT' ? 50 : 0;
    const subContainerMargin = orientation !== 'PORTRAIT' ? 0 : 50;

    return (
      <ImageBackground
        //source={Images.image_touku_bg}
        source={
          Platform.isPad ? Images.image_touku_bg : Images.image_touku_bg_phone
        }
        style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.keyboardScrollContentContainer}
            showsVerticalScrollIndicator={false}>
            <BackHeader onBackPress={() => this.props.navigation.goBack()} />
            <View
              style={[{paddingHorizontal: containerPadding}, styles.container]}>
              <Text style={[globalStyles.bigSemiBoldText, styles.createTicket]}>
                {translate('pages.setting.createTicket')}
              </Text>
              <View
                style={[{marginTop: subContainerMargin}, styles.subContainer]}>
                <Inputfield
                  value={title}
                  placeholder={translate('pages.setting.ticketTitle')}
                  onChangeText={(text) => this.setState({title: text})}
                  onSubmitEditing={() => {
                    this.focusNextField('description');
                  }}
                />
                <Inputfield
                  height={100}
                  numberOfLines={5}
                  onRef={(ref) => {
                    this.inputs.description = ref;
                  }}
                  value={description}
                  placeholder={translate('pages.setting.ticketDescription')}
                  onChangeText={(text) => this.setState({description: text})}
                />

                <View style={styles.dropdownContainer}>
                  <DropDown />
                </View>
                <View style={styles.submitButttonContainer}>
                  <Button type={'primary'} title={translate('common.submit')} />
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
