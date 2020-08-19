import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import { Colors, Fonts } from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { connect } from 'react-redux';

class UploadSelectModal extends Component {
  constructor(props) {
    super(props);
      setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {};
  }

  send = async (type) => {
    this.props.onSelect(type);
  };

  render() {
    const { visible, toggleSelectModal, onSelect } = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={() => toggleSelectModal(false)}
        onBackdropPress={() => toggleSelectModal(false)}
      >
        <SafeAreaView
          style={{
            // flex: '10%',
            height: '20%',
            alignSelf: 'center',
            width: '60%',
          }}
        >
          <View
            style={{
              flex: this.state.orientation === 'LANDSCAPE' ? 0.9 : 0.95,
              backgroundColor: Colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LinearGradient
              start={{ x: 0.1, y: 0.7 }}
              end={{ x: 0.5, y: 0.8 }}
              locations={[0.1, 0.6, 1]}
              colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
              style={{
                flex: 0.3,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 18,
                  fontFamily: Fonts.extrabold,
                }}
              >{translate('pages.xchat.uploadType')}
              </Text>
            </LinearGradient>
            <View style={{ flex: 0.7 }}>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.send('images')}
              >
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 14,
                    fontFamily: Fonts.medium,
                  }}
                >
                    {translate('pages.xchat.image')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.send('video')}
              >
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 14,
                    fontFamily: Fonts.medium,
                  }}
                >
                    {translate('pages.xchat.videoForUploadType')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadSelectModal);
