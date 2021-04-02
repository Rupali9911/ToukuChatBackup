import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';

import {Colors, Icons} from '../../constants';
import {globalStyles} from '../../styles';
import data from './data';
import styles from './styles';

const initialState = {
  isChecked: false,
  selectedItem: 'Select',
  data,
};

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.state.data.map((item) => {
      if (item.selected) {
        // TODO: Do something when item is selected!
      }
    });
  }

  onSelectItem = (item, index) => {
    let tempData = this.state.data;
    tempData.map((itemValue) => {
      itemValue.selected = false;
    });

    tempData[index].selected = true;
    this.setState((prevState) => {
      return {
        isChecked: !prevState.isChecked,
        selectedItem: item,
      };
    });
  };

  onSelectPress = (item) => {
    this.setState((prevState) => {
      return {
        isChecked: !prevState.isChecked,
        selectedItem: item,
      };
    });
  };

  getActiveItemColor = (item) => {
    if (item.selected) {
      return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
    } else {
      return [Colors.white, Colors.white, Colors.white];
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.onSelectPress(this.state.selectedItem)}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.5, y: 0.8}}
            locations={[0.1, 0.6, 1]}
            colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
            style={styles.subContainer}>
            <View>
              <Text style={globalStyles.smallLightText}>
                {this.state.selectedItem}
              </Text>
            </View>
            <View>
              <Image
                source={Icons.icon_triangle_down}
                style={styles.dropdownIcon}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {this.state.isChecked ? (
          <View style={styles.checkedContainer}>
            {this.state.data.map((item, key) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.onSelectItem(item.title, key)}>
                <LinearGradient
                  start={{x: 0.1, y: 0.7}}
                  end={{x: 0.5, y: 0.8}}
                  locations={[0.1, 0.6, 1]}
                  colors={this.getActiveItemColor(item)}
                  style={[
                    styles.subContainer,
                    {backgroundColor: Colors.white},
                  ]}>
                  <View>
                    <Text
                      style={[
                        globalStyles.smallLightText,
                        {
                          color: item.selected
                            ? Colors.white
                            : Colors.gradient_2,
                        },
                      ]}>
                      {item.title}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    );
  }
}

DropDown.propTypes = {
  isChecked: PropTypes.bool,
  onPress: PropTypes.func,
  onOtherLanguagePress: PropTypes.func,
};

DropDown.defaultProps = {
  isChecked: false,
  onPress: null,
  onOtherLanguagePress: null,
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

export default connect(mapStateToProps, null)(DropDown);
