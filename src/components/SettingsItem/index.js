import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';
import {globalStyles} from '../../styles';
import {Icons, Colors} from '../../constants';

export default class SettingsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {icon, title} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={{marginEnd: 15}}>
            <Image
              source={icon}
              style={[globalStyles.iconStyle, {tintColor: Colors.black}]}
            />
          </View>
          <Text style={[globalStyles.normalLightText, {color: Colors.black}]}>
            {title}
          </Text>
        </View>
        <View></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

SettingsItem.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
};

SettingsItem.defaultProps = {
  icon: Icons.icon_more,
  title: 'Title',
};
