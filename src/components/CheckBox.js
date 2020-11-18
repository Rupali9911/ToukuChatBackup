import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import {Colors} from '../constants';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getGradientColors() {
    if (this.props.isChecked) {
      return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
    } else {
      return [Colors.white, Colors.white, Colors.white];
    }
  }

  render() {
    const {onCheck, isChecked, isFromSignUp} = this.props;
      if(isFromSignUp){
          return (
              <TouchableOpacity
          style={{
              width: 25,
                  height: 25,
                  borderRadius: 4,
                  margin: 5,
          }}
          onPress={onCheck}>
              <FontAwesome5 name={isChecked ? 'check-square' : 'square' }  color= {Colors.green} size={25}/>
      </TouchableOpacity>
          )
      }else{
          return(
              <TouchableOpacity
                  style={{
                      width: 25,
                      height: 25,
                      borderRadius: 12.5,
                      borderColor:'#ccc',
                      borderWidth:isChecked?0:1,
                      margin: 5,
                  }}
                  onPress={onCheck}>
                  <FontAwesome name={isChecked ? 'check-circle' : 'circle' }  color= {isChecked?Colors.primary:Colors.white} size={25}/>
              </TouchableOpacity>
          )
      }
  }
}

CheckBox.propTypes = {
  isChecked: PropTypes.bool,
  /**
   * Callbacks
   */
  onCheck: PropTypes.func,
};

CheckBox.defaultProps = {
  isChecked: false,
  onCheck: null,
};
