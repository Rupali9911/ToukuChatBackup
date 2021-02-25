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
import SecondaryButton from '../SecondaryButton';
import Feather from 'react-native-vector-icons/Feather';
import {translate} from '../../redux/reducers/languageReducer';
import { normalize } from '../../utils';

export default class DeleteOptionModal extends Component {
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
      isDeleteMeLoading,
      isDeleteEveryoneLoading
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
            <View style={{ flexDirection: 'column', marginTop: 20 }}>
                <Button
                  title={translate('swal.deleteFromMe')}
                  type={'primary'}
                  height={normalize(28)}
                  onPress={(isDeleteMeLoading || isDeleteEveryoneLoading) ? null : ()=>{
                    onConfirm('DELETE_FOR_ME')
                  }}
                  isRounded={false}
                  loading={isDeleteMeLoading}
                />
                <Button
                  title={confirmText ? confirmText : translate('swal.deleteFromeveyOne')}
                  type={'primary'}
                  height={normalize(28)}
                  onPress={(isDeleteMeLoading || isDeleteEveryoneLoading) ? null : ()=>{
                    onConfirm('DELETE_FOR_EVERYONE')
                  }}
                  isRounded={false}
                  loading={isDeleteEveryoneLoading}
                />
                <Button
                  title={cancelText ? cancelText : translate('common.cancel')}
                  type={'secondary'}
                  height={normalize(28)}
                  onPress={onCancel}
                  isRounded={false}
                />
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
