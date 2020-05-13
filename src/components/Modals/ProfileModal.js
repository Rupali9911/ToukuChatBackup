import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import {Colors, Fonts, Images, Icons} from '../../constants';
import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import {ChangePassModal, ChangeEmailModal, ChangeNameModal} from '../Modals';

class ProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChangePassModalVisible: false,
      isChangeEmailModalVisible: false,
      isChangeNameModalVisible: false,
    };
  }

  onShowChangePassModal() {
    this.setState({isChangePassModalVisible: true});
  }

  onShowChangeEmailModal() {
    this.setState({isChangeEmailModalVisible: true});
  }

  onShowChangeNameModal() {
    this.setState({isChangeNameModalVisible: true});
  }

  render() {
    const {visible, onRequestClose, userData} = this.props;
    const {
      isChangePassModalVisible,
      isChangeEmailModalVisible,
      isChangeNameModalVisible,
    } = this.state;
    return (
      <Modal
        isVisible={visible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        backdropOpacity={0.4}
        onBackButtonPress={onRequestClose}
        onBackdropPress={onRequestClose}
        style={styles.modalBackground}>
        <View style={styles.Wrapper}>
          <ScrollView
            contentContainerStyle={{backgroundColor: Colors.white}}
            showsVerticalScrollIndicator={false}>
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.8, y: 0.3}}
              locations={[0.3, 0.5, 0.8, 1, 1]}
              colors={['#9440a3', '#c13468', '#ee2e3b', '#fa573a', '#fca150']}
              // colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
              style={styles.firstView}>
              <View style={styles.firstBottomView}>
                <View
                  style={[
                    globalStyles.iconStyle,
                    {
                      backgroundColor: Colors.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      borderWidth: 1,
                    },
                  ]}>
                  <ClickableImage
                    source={Icons.icon_camera}
                    size={14}
                    onClick={() => {}}
                  />
                </View>
              </View>

              <TouchableOpacity onPress={onRequestClose}>
                <Image source={Icons.icon_close} style={styles.iconClose} />
              </TouchableOpacity>
            </LinearGradient>

            <View style={{alignSelf: 'center', marginTop: -40}}>
              <RoundedImage
                size={80}
                source={{uri: userData.avatar}}
                clickable={true}
              />
              <View style={styles.centerBottomView}>
                <View
                  style={[
                    globalStyles.iconStyle,
                    {
                      backgroundColor: Colors.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      borderWidth: 1,
                    },
                  ]}>
                  <ClickableImage
                    source={Icons.icon_camera}
                    size={14}
                    onClick={() => {}}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  globalStyles.smallRegularText,
                  {color: Colors.black, margin: 10},
                ]}>
                {userData.username}
              </Text>
              <RoundedImage
                source={Icons.icon_edit_pen}
                size={18}
                clickable={true}
                isRounded={false}
                onClick={() => this.onShowChangeNameModal()}
              />
            </View>
            {/* Password */}
            <View style={styles.inputTextContainer}>
              <View style={{flex: 1}}>
                <Text
                  style={[globalStyles.smallRegularText, styles.textNormal]}>
                  {'Password'}
                </Text>
                <TextInput
                  style={[globalStyles.smallRegularText, styles.textNormal]}
                  placeholder={'**********'}
                  editable={false}
                />
              </View>
              <ClickableImage
                source={Icons.icon_edit_pen}
                size={18}
                onClick={() => this.onShowChangePassModal()}
              />
            </View>

            {/* Email */}
            <View style={styles.inputTextContainer}>
              <View style={{flex: 1}}>
                <Text
                  style={[globalStyles.smallRegularText, styles.textNormal]}>
                  {'Email'}
                </Text>
                <TextInput
                  style={[globalStyles.smallRegularText, styles.textNormal]}
                  placeholder={'xyz@abc.com'}
                  placeholderTextColor={Colors.black}
                  value={userData.email}
                  editable={false}
                />
              </View>
              <RoundedImage
                source={Icons.icon_edit_pen}
                size={18}
                clickable={true}
                isRounded={false}
                onClick={() => this.onShowChangeEmailModal()}
              />
            </View>
            {/* Country */}
            <View style={{padding: 10}}>
              <Text style={[globalStyles.smallRegularText, styles.textNormal]}>
                {'Country'}
              </Text>
              <TextInput
                style={[globalStyles.smallRegularText, styles.textNormal]}
                placeholder={'Country Name'}
                value={userData.country}
                editable={false}
              />
            </View>
            {/* Phone */}
            <View style={{padding: 10}}>
              <Text style={[globalStyles.smallRegularText, styles.textNormal]}>
                {'Phone'}
              </Text>
              <TextInput
                style={[globalStyles.smallRegularText, styles.textNormal]}
                placeholder={'Phone Number'}
                value={userData.phone}
                editable={false}
              />
            </View>
          </ScrollView>
          <ChangePassModal
            visible={isChangePassModalVisible}
            onRequestClose={() =>
              this.setState({isChangePassModalVisible: false})
            }
          />
          <ChangeEmailModal
            visible={isChangeEmailModalVisible}
            onRequestClose={() =>
              this.setState({isChangeEmailModalVisible: false})
            }
          />
          <ChangeNameModal
            visible={isChangeNameModalVisible}
            onRequestClose={() =>
              this.setState({isChangeNameModalVisible: false})
            }
          />
        </View>
      </Modal>
    );
  }
}

export const ClickableImage = (props) => {
  const {size, source, onClick} = props;
  return (
    <TouchableOpacity onPress={onClick}>
      <Image
        source={source}
        style={{width: size, height: size, resizeMode: 'contain'}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    display: 'flex',
  },
  Wrapper: {
    width: '80%',
    backgroundColor: 'transparent',
    display: 'flex',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  firstView: {
    height: 150,
    borderBottomWidth: 1,
    alignItems: 'flex-end',
    padding: 10,
  },
  firstBottomView: {
    bottom: 0,
    position: 'absolute',
    padding: 10,
  },
  centerBottomView: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  iconClose: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  textNormal: {
    textAlign: 'left',
    color: Colors.black,
  },
  inputTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileModal);
