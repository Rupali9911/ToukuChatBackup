import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Icons} from '../../constants';
import {globalStyles} from '../../styles';

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      selectedItem: 'Select',
      data: [
        {
          id: 1,
          title: 'Unable To Register',
          selected: false,
        },

        {
          id: 2,
          title: 'Not Getting Currect Data',
          selected: false,
        },

        {
          id: 3,
          title: 'Unable To Login',
          selected: false,
        },
      ],
    };
  }

  componentDidMount() {
    this.state.data.map((item) => {
      if (item.selected == true) {
      }
    });
  }

  onSelectItem = (item, index) => {
    let data = this.state.data;
    data.map((item) => {
      item.selected = false;
    });

    data[index].selected = true;
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
    const {isChecked, data, selectedItem} = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.onSelectPress(selectedItem)}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.5, y: 0.8}}
            locations={[0.1, 0.6, 1]}
            colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
            style={styles.subContainer}>
            <View>
              <Text style={globalStyles.smallLightText}>{selectedItem}</Text>
            </View>
            <View>
              <Image
                source={Icons.icon_triangle_down}
                style={{width: 10, height: 10, resizeMode: 'contain'}}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {isChecked ? (
          <View
            style={{
              zIndex: 100,
              overflow: 'hidden',
              paddingTop: 10,
              backgroundColor: Colors.white,
            }}>
            {data.map((item, key) => (
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
const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
  },
  subContainer: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});

DropDown.propTypes = {
  isChecked: PropTypes.bool,
  /**
   * Callbacks
   */
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DropDown);
