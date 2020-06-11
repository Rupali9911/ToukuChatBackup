import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Clipboard} from 'react-native';
import PropTypes from 'prop-types';
import {Colors} from '../constants';
import {Switch} from "react-native-switch";

export default class SwitchCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render(){
        const {value, onValueChange} = this.props
        return (
            <Switch
            containerStyle={{
                borderWidth: 2,
                paddingVertical: 10,
                borderColor: Colors.gradient_2}}
            value={value}
            onValueChange={(value) => onValueChange(value)}
            circleSize={18}
            barHeight={20}
            innerCircleStyle={{
                borderColor: Colors.gradient_1}}
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
        )
    }

}

SwitchCustom.propTypes = {
    value: PropTypes.bool,
    onValueChange: PropTypes.func,
};

SwitchCustom.defaultProps = {
    value: false,
    onValueChange: null
};
