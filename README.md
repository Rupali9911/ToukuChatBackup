# touku-native

## After npm install

### To enable login with line

- copy LineLogin.java from ./LineLibChanges and replace it with ./node_modules/react-native-line-sdk/android/src/main/java/com/xmartlabs/lineloginmanager/LineLogin.java
- copy strings.xml from ./LineLibChanges and replace it with ./node_modules/react-native-line-sdk/android/src/main/res/values/strings.xml

### To fix webview error in android

- comment "import com.facebook.react.views.webview.ReactWebViewManager" line 12 in ./node_modules/react-native-doc-viewer/android/src/main/java/com/reactlibrary/RNReactNativeDocViewerModule.java

### To fix pod install issue (target has frameworks with conflicting names: twitterkit.framework.)

- update (s.dependency "TwitterKit", "~> 3.3") to (s.dependency "TwitterKit5") in ./node_modules/react-native-twitter-signin/react-native-twitter-signin.podspec as show in image below.

<img src="./redmeAssets/twiterError.png"
     alt="Markdown Monster icon"
     width="150px"
     height="300px"
     style="float: left; margin-right: 5px; width:200px"/>
