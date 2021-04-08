// Library imports
import React, {Component} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Divider} from 'react-native-paper';

// Local imports
import {Colors} from '../../../constants';

// StyleSheet import
import styles from './styles';

/**
 * Channel category modal component
 */
export default class ChannelCategoryModal extends Component {
  // Renders the channel category list
  renderChannelCategory(category) {
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={category}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => this.props.selectCategory(item.id)}>
            <View style={styles.nameContainer}>
              <Text>{item.name}</Text>
            </View>
            <View style={styles.selectionContainer}>
              <View
                style={[
                  {
                    borderColor: item.isSelected ? Colors.purple : Colors.black,
                  },
                  styles.selectionSubContainer,
                ]}>
                {item.isSelected && <View style={styles.selectedContainer} />}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => {
          return <Divider />;
        }}
      />
    );
  }

  render() {
    const {visible, category} = this.props;
    return (
      <Modal isVisible={visible}>
        <View style={styles.container}>
          {this.renderChannelCategory(category)}
        </View>
      </Modal>
    );
  }
}
