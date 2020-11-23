import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import {Menu, Divider} from 'react-native-paper';
import {Colors, Fonts, Images, Icons} from '../../constants';
import Button from '../Button';
import Feather from 'react-native-vector-icons/Feather';
import {translate} from '../../redux/reducers/languageReducer';

export default class ConfirmationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visible,
      onCancel,
      onConfirm,
      title,
      confirmText,
      cancelText,
      message,
      orientation,
      isLoading,
    } = this.props;
    return (
      <Modal isVisible={visible}>
        <View style={style.container}>
          <View style={style.innerContainer}>
            <Image
              source={Icons.icon_info}
              style={style.alertImage}
              resizeMode={'contain'}
            />

            <View style={style.detailsAreaView}>
              <Text style={style.alertTitleTextStyle}>{title}</Text>
              <Text style={style.alertmessageTextStyel}>
                {message ? message : ''}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View
                style={{
                  flex: 1,
                }}>
                <Button
                  title={cancelText?cancelText:translate('common.cancel')}
                  type={'secondary'}
                  onPress={onCancel}
                  isRounded={false}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  marginLeft: 10,
                }}>
                <Button
                  title={confirmText?confirmText:translate('pages.xchat.toastr.sure')}
                  type={'primary'}
                  onPress={isLoading ? null : onConfirm}
                  isRounded={false}
                  loading={isLoading}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 5,
  },
  alertImage: {
    height: 70,
    width: 70,
    tintColor: Colors.orange_light,
    marginBottom: 25,
  },
  detailsAreaView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  alertTitleTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    marginBottom: 10,
      textAlign: 'center'
  },
  alertmessageTextStyel: {
    fontFamily: Fonts.light,
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
  },
});
