import {NavigationActions, StackActions} from 'react-navigation';
import {useRoute} from '@react-navigation/native';


let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function navigate(routeName, params) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function goBack(routeName, params) {
  navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    }),
  );
}

function replace(routeName, params) {
  navigator.dispatch(
    StackActions.replace({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    }),
  );
}

function pop() {
  navigator.dispatch(StackActions.pop());
}

function popToTop() {
  navigator.dispatch(StackActions.popToTop());
}

function getCurrentRoute() {
    let route = navigator.state.nav
    while(route.routes) {
        route = route.routes[route.index]
    }
    return route
}

function navigateToScreen2Via1(screen1, screen2) {
    navigator.dispatch(
        StackActions.reset({
            index: 1,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName:  screen1}),
                NavigationActions.navigate({ routeName:  screen2})
            ]
        })
    );

}
// add other navigation functions that you need and export them

export default {
  navigate,
  goBack,
  replace,
  pop,
  popToTop,
  setTopLevelNavigator,
    getCurrentRoute,
    navigateToScreen2Via1
};
