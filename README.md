# touku-native

## After npm install

### To enable login with line

- copy LineLogin.java from ./LineLibChanges and replace it with ./node_modules/react-native-line-sdk/android/src/main/java/com/xmartlabs/lineloginmanager/LineLogin.java
- copy strings.xml from ./LineLibChanges and replace it with ./node_modules/react-native-line-sdk/android/src/main/res/values/strings.xml

### To fix webview error in android

- comment "import com.facebook.react.views.webview.ReactWebViewManager" line 12 in ./node_modules/react-native-doc-viewer/android/src/main/java/com/reactlibrary/RNReactNativeDocViewerModule.java
