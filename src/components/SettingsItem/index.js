import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {globalStyles} from '../../styles';
import {Icons, Colors} from '../../constants';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default class SettingsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

render() {
      const {icon, title, icon_name, icon_color, onPress, isImage, isFontAwesome} = this.props;
    const conditionalRender = ()=>{
        if (isImage){
            return <Image source={isImage} style={{width: 20, height: 20}} resizeMode={'cover'}/>
        }else if (isFontAwesome) {
            return <FontAwesome name={icon_name} size={20}/>
        }else{
            return <FontAwesome5 name={icon_name} size={20}/>
        }
    }
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.row}>
          <View style={{marginEnd: 15}}>
              {conditionalRender()}
          </View>
          <Text style={[globalStyles.smallRegularText, {color: Colors.black}]}>
            {title}
          </Text>
        </View>
        <View></View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

SettingsItem.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
    icon_name: PropTypes.string,
    onPress: PropTypes.func,
    isImage: PropTypes.string,
    isFontAwesome: PropTypes.bool
};

SettingsItem.defaultProps = {
  icon: Icons.icon_more,
  title: 'Title',
    icon_name: 'user',
    icon_color: Colors.dark_gray,
    onPress: null,
    isImage: null,
    isFontAwesome: false
};
