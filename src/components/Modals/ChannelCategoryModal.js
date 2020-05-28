import React, { Component } from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { Menu, Divider } from 'react-native-paper';
import { Colors } from '../../constants';

export default class ChannelCategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderChannelCategory(category) {
    return (
      <FlatList
        data={category}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              height: 60,
              paddingHorizontal: 10,
            }}
            onPress={() => this.props.selectCategory(item.id)}
          >
            <View
              style={{
                flex: 0.8,
                justifyContent: 'center',
              }}
            >
              <Text>{item.name}</Text>
            </View>
            <View
              style={{
                flex: 0.2,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: item.isSelected ? Colors.purple : Colors.black,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {item.isSelected && (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 20,
                      backgroundColor: Colors.purple,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                )}
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
    const { visible, category } = this.props;
    return (
      <Modal isVisible={visible}>
        <View
          style={{ flex: 1, backgroundColor: Colors.white, borderRadius: 5 }}
        >
          {this.renderChannelCategory(category)}
        </View>
      </Modal>
    );
  }
}
