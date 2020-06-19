import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import { Colors, Fonts } from '../constants';
import { translate } from '../redux/reducers/languageReducer';

const { width, height } = Dimensions.get('window');


export default class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { tabBarItem, activeTab } = this.props;
    return (
      <View style={styles.Container}>
        {tabBarItem.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                item.title === activeTab && {
                  borderBottomWidth: 1.5,
                  borderBottomColor: Colors.gradient_1,
                },
              ]}
              onPress={item.action}
            >
              <Text style={[styles.tabTitle]}>
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

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    height: height * 0.06,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: Platform.OS === 'ios' ? 0.3 : 0.2,
    borderBottomColor: Colors.gray_dark,
  },
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_1,
    fontFamily: Fonts.regular,
  },
});
