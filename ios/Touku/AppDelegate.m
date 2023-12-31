#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <TwitterKit/TWTRKit.h>
#import "RNSplashScreen.h"
#import <LineSDK/LineSDK.h>
#import <Firebase.h>
@import UIKit;
@import GoogleSignIn;
#import <KakaoOpenSDK/KakaoOpenSDK.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTLinkingManager.h>
// #if DEBUG
// #import <FlipperKit/FlipperClient.h>
// #import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
// #import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
// #import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
// #import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
// #import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>


// static void InitializeFlipper(UIApplication *application) {
//   FlipperClient *client = [FlipperClient sharedClient];
//   SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
//   [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
//   [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
//   [client addPlugin:[FlipperKitReactPlugin new]];
//   [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
//   [client start];
// }
// #endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
//#if DEBUG
//  InitializeFlipper(application);
//#endif

  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  [[FBSDKApplicationDelegate sharedInstance] application:application
  didFinishLaunchingWithOptions:launchOptions];

  [[Twitter sharedInstance] startWithConsumerKey:@"BvR9GWViH6r35PXtNHkV5MCxd" consumerSecret:@"2R6vK7nCsWIYneFgmlvBQUSbajD1djiYMIFLwwElZMYaa3r6Q8"];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Touku"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];  
  [RNSplashScreen show];

   // Define UNUserNotificationCenter
   UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
   center.delegate = self;
  
   return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {


  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
  openURL:url
  sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                             annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];

  BOOL handledT = [[Twitter sharedInstance] application:application openURL:url options:options];
  // Add any custom logic here.

   BOOL handledL = [[LineSDKLogin sharedInstance] handleOpenURL:url];

  if ([KOSession isKakaoAccountLoginCallback:url]) {
      return [KOSession handleOpenURL:url];
  }

  BOOL handleLinking = [RCTLinkingManager application:application openURL:url options:options];

  return handled || handledT || handledL || handleLinking;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
                                      sourceApplication:(NSString *)sourceApplication
                                              annotation:(id)annotation {
    if ([KOSession isKakaoAccountLoginCallback:url]) {
        return [KOSession handleOpenURL:url];
    }

  BOOL handleLinking = [RCTLinkingManager application:application openURL:url
  sourceApplication:sourceApplication annotation:annotation];

    return handleLinking || false;
}

//- (void)applicationDidBecomeActive:(UIApplication *)application
//{
//  [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
//    [KOSession handleDidBecomeActive];
//}
//
//-(void)applicationDidEnterBackground:(UIApplication *)application{
//  [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
//}

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
 [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// IOS 10+ Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  completionHandler();
}
// IOS 4-10 Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
 [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  return [RCTLinkingManager
            application:application
            continueUserActivity:userActivity
            restorationHandler:restorationHandler
         ];
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
