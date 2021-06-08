import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../../constants';
import styles from './styles';
import { Badge } from 'react-native-paper';


/**
 * Count Checkbox media selection from picker
 * @prop {number} count - selection count of selected media
 * @prop {function} onCheck - function call on selection
 * @returns JSX
 */
const CountCheckBox = (props) => {
    const {onCheck, count} = props;
    const checkedCircleContainer = {
      borderWidth: count>0 ? 0 : 2,
    };
    return (
      <TouchableOpacity
        style={[styles.actionContainer, checkedCircleContainer]}
        onPress={onCheck.bind(null,count)}>
        {count>0?<Badge size={25} style={styles.badgeStyle}>{count}</Badge>:null}
      </TouchableOpacity>
    );
}

export default CountCheckBox;
