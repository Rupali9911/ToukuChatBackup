// Library imports
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Component imports
import Button from '../../Button';
import RoundedImage from '../../RoundedImage';

// Local imports
import {Colors, Icons} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';
import {getImage} from '../../../utils';

// StyleSheet import
import styles from './styles';

/**
 * Background image modal component
 */
export default class BackgroundImgModal extends Component {
  // Pass bacground data from
  onSelectBackground = (item, index) => {
    this.props.onSelectBackground(item, index);
  };

  // Post actions after setting background image
  onSetBackground = () => {
    this.props.toggleBackgroundImgModal();
    this.props.onSetBackground();
  };

  render() {
    const {visible, backgroudImages, toggleBackgroundImgModal} = this.props;

    const container = [
      styles.container,
      {
        flex: this.state.orientation === 'LANDSCAPE' ? 0.9 : 0.95,
      },
    ];

    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={toggleBackgroundImgModal}
        onBackdropPress={toggleBackgroundImgModal}>
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.wallpaperContainer}>
            <View style={styles.wallpaperTextContainer}>
              <Text>{translate('pages.xchat.wallpaper')}</Text>
            </View>
            <TouchableOpacity
              style={styles.wallpaperImageContainer}
              onPress={toggleBackgroundImgModal}>
              <Image source={Icons.icon_close} style={styles.wallpaperImage} />
            </TouchableOpacity>
          </View>
          <View style={container}>
            <FlatList
              numColumns={2}
              data={backgroudImages}
              extraData={this.props.extraData}
              keyExtractor={(item, index) => String(index)}
              renderItem={({item, index}) => (
                <View style={styles.listItemContainer}>
                  <View style={styles.avatarContainer}>
                    <View
                      style={[
                        styles.avatarSubContainer,
                        {
                          borderColor: item.isSelected
                            ? Colors.green
                            : Colors.gray,
                        },
                      ]}>
                      <RoundedImage
                        source={getImage(item.uri)}
                        size={92}
                        resizeMode={'cover'}
                        borderSize={item.isSelected ? 2 : 0}
                        borderColor={Colors.green}
                      />
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.actionContainer}
                      onPress={this.onSelectBackground.bind(this, item, index)}>
                      {item.isSelected && (
                        <MaterialIcons
                          name={'check'}
                          color={Colors.green}
                          size={16}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <View>
              <Button
                type={'primary'}
                title={translate('pages.xchat.set')}
                onPress={this.onSetBackground.bind(this)}
                isRounded={false}
              />
              <Button
                type={'secondary'}
                title={translate('common.cancel')}
                onPress={toggleBackgroundImgModal}
                isRounded={false}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
