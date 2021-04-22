import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {translate} from '../../redux/reducers/languageReducer';
import styles from './styles';

export default class TabBar extends Component {
  render() {
    const {tabBarItem, activeTab} = this.props;
    return (
      <View style={styles.container}>
        {tabBarItem.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                item.title === activeTab && styles.itemActionContainer,
              ]}
              onPress={item.action}>
              <Text numberOfLines={1} style={[styles.tabTitle]}>
                {translate(`pages.xchat.${item.title}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

TabBar.propTypes = {
  value: PropTypes.object,
};

TabBar.defaultProps = {
  value: {},
};
