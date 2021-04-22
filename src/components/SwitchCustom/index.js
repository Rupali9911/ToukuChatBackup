import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Switch} from 'react-native-switch';
import {Colors} from '../../constants';
import styles from './styles';

export default class SwitchCustom extends Component {
  render() {
    const {value, onValueChange} = this.props;
    return (
      <Switch
        containerStyle={styles.container}
        value={value}
        onValueChange={(postValue) => onValueChange(postValue)}
        circleSize={18}
        barHeight={20}
        innerCircleStyle={{
          borderColor: Colors.gradient_1,
        }}
        circleBorderWidth={0}
        backgroundActive={'#FFDBE9'}
        backgroundInactive={Colors.white}
        circleActiveColor={Colors.gradient_1}
        circleInActiveColor={Colors.gradient_1}
        switchLeftPx={2.2}
        switchRightPx={1.7}
        switchWidthMultiplier={2.5}
        useNativeDriver={false}
      />
    );
  }
}

SwitchCustom.propTypes = {
  value: PropTypes.bool,
  onValueChange: PropTypes.func,
};

SwitchCustom.defaultProps = {
  value: false,
  onValueChange: null,
};
