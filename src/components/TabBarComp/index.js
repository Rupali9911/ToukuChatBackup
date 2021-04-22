/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-did-mount-set-state */
import React, {Component} from 'react';
import {Keyboard, Platform, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {Colors} from '../../constants';
import {isIphoneX} from '../../utils';
import styles from './styles';

class TabBarComp extends Component {
  state = {
    routes: [],
    isVisible: true,
  };

  constructor(props) {
    super(props);
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
  }

  componentDidMount() {
    const {navigation} = this.props;
    const {routes} = navigation.state;
    this.setState({routes});

    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardWillHide,
    );
  }

  componentDidUpdate(prevProps) {
    const prevSelectedLang = prevProps.selectedLanguageItem.language_name;
    const currentSelectedLang = this.props.selectedLanguageItem.language_name;
    if (prevSelectedLang !== currentSelectedLang) {
      const routes = [...this.state.routes];

      this.setState({routes});
    }
  }

  componentWillUnmount() {
    this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
  }

  keyboardWillShow = (event) => {
    Platform.OS === 'android' &&
      this.setState({
        isVisible: false,
      });
  };

  keyboardWillHide = (event) => {
    this.setState({
      isVisible: true,
    });
  };

  render() {
    console.log('dimen.height', isIphoneX());
    const {routes, isVisible} = this.state;
    const {
      renderIcon,

      activeTintColor,
      inactiveTintColor,
      onTabPress,
      onTabLongPress,
      getAccessibilityLabel,
      navigation,
    } = this.props;
    console.log(routes);
    const {index: activeRouteIndex} = navigation.state;
    return isVisible ? (
      <LinearGradient
        //   start={{ x: 0.1, y: 0.7 }}
        //   end={{ x: 0.5, y: 0.2 }}
        locations={[0, 0.97, 1]}
        colors={[
          Colors.foorter_gradient_1,
          Colors.foorter_gradient_2,
          Colors.foorter_gradient_3,
        ]}
        useAngle={true}
        angle={180}
        angleCenter={{x: 0, y: 0.3}}
        style={[styles.container]}>
        {routes.map((route, routeIndex) => {
          const isRouteActive = routeIndex === activeRouteIndex;
          const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
          // if(route.routeName === "Rewards" && userData.user_type!=='owner' && userData.user_type!=='tester' && userData.user_type!=='company'){
          //   return null;
          // }
          return (
            <TouchableOpacity
              key={routeIndex}
              style={[styles.tabButton]}
              onPress={() => {
                // if(route.routeName === "Rewards"){
                //   if(userData.user_type==='owner' || userData.user_type==='company' || userData.user_type==='tester'){
                //     onTabPress({route});
                //   }else{
                //     Toast.show({
                //       title: 'TOUKU',
                //       text: translate('pages.clasrm.comingSoon'),
                //       type: 'positive'
                //     });
                //   }
                // }else{
                //   onTabPress({route});
                // }
                onTabPress({route});
              }}
              onLongPress={() => {
                // if (route.routeName === "Rewards") {
                //   if (userData.user_type === 'owner' || userData.user_type === 'company' || userData.user_type === 'tester') {
                //     onTabPress({ route });
                //   } else {
                //     Toast.show({
                //       title: 'TOUKU',
                //       text: translate('pages.clasrm.comingSoon'),
                //       type: 'positive'
                //     });
                //   }
                // } else {
                //   onTabLongPress({ route });
                // }
                onTabLongPress({route});
              }}
              accessibilityLabel={getAccessibilityLabel({route})}>
              {renderIcon({route, focused: isRouteActive, tintColor})}
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    ) : null;
  }
}

// const TabBarComp = (props) => {
//     const dimen = Dimensions.get('window');
// console.log('dimen.height', isIphoneX())
//   const {
//     renderIcon,
//     getLabelText,
//     activeTintColor,
//     inactiveTintColor,
//     onTabPress,
//     onTabLongPress,
//     getAccessibilityLabel,
//     navigation,
//   } = props;

//   const { routes, index: activeRouteIndex } = navigation.state;

//   return (
//     <LinearGradient
//       //   start={{ x: 0.1, y: 0.7 }}
//       //   end={{ x: 0.5, y: 0.2 }}
//       locations={[0, 1]}
//       colors={[Colors.foorter_gradient_1, Colors.foorter_gradient_2]}
//       useAngle={true}
//       angle={192.48}
//       angleCenter={{ x: 0.8, y: 0 }}
//       style={[S.container]}
//     >
//       {routes.map((route, routeIndex) => {
//         const isRouteActive = routeIndex === activeRouteIndex;
//         const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

//         return (
//           <TouchableOpacity
//             key={routeIndex}
//             style={[S.tabButton]}
//             onPress={() => {
//               onTabPress({ route });
//             }}
//             onLongPress={() => {
//               onTabLongPress({ route });
//             }}
//             accessibilityLabel={getAccessibilityLabel({ route })}
//           >
//             {renderIcon({ route, focused: isRouteActive, tintColor })}
//           </TouchableOpacity>
//         );
//       })}
//     </LinearGradient>
//   );
// };

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
  };
};

export default connect(mapStateToProps)(TabBarComp);
