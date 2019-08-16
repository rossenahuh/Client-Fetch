/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTPushNotificationManager.h>
#import <UserNotifications/UserNotifications.h>
#import "RNFirebaseMessaging.h"
#import "RNFirebaseNotifications.h"
#import <Firebase.h>

@import Firebase;
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"fetch_client2"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];

  // [START configure_firebase]
  [FIRApp configure];
  // [END configure_firebase]
  
  // [START set_messaging_delegate]
  [FIRMessaging messaging].delegate = self;
  // [END set_messaging_delegate]
  
  // Register for remote notifications. This shows a permission dialog on first run, to
  // show the dialog at a more appropriate time move this registration accordingly.
  // [START register_for_notifications]
  if ([UNUserNotificationCenter class] != nil) {
    // iOS 10 or later
    // For iOS 10 display notification (sent via APNS)
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
    UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter]
     requestAuthorizationWithOptions:authOptions
     completionHandler:^(BOOL granted, NSError * _Nullable error) {
       // ...
     }];
  } else {
    // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
    UIUserNotificationType allNotificationTypes =
    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings =
    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
    [application registerUserNotificationSettings:settings];
  }
  
  [application registerForRemoteNotifications];
  // [END register_for_notifications]

  
//  [[FIRInstanceID instanceID] instanceIDWithHandler:^(FIRInstanceIDResult * _Nullable result,
//                                                      NSError * _Nullable error) {
//    if (error != nil) {
//      NSLog(@"Error fetching remote instance ID: %@", error);
//    } else {
//      NSLog(@"Remote instance ID token: %@", result.token);
//      NSString* message =
//      [NSString stringWithFormat:@"Remote InstanceID token: %@", result.token];
//      self.instanceIDTokenMessage.text = message;
//    }
//  }];
//
  
  NSString *userAgent = @"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36";
  NSDictionary *dictionary = [[NSDictionary alloc] initWithObjectsAndKeys:userAgent, @"UserAgent", nil];
  [[NSUserDefaults standardUserDefaults] registerDefaults:dictionary];
  [[UIApplication sharedApplication] registerForRemoteNotifications];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  return YES;
}

// [START receive_message]
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
//  // If you are receiving a notification message while your app is in the background,
//  // this callback will not be fired till the user taps on the notification launching the application.
//  // TODO: Handle data of notification
//
//  // With swizzling disabled you must let Messaging know about the message, for Analytics
//  // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
//
//  // Print message ID.
//  if (userInfo[kGCMMessageIDKey]) {
//    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
//  }
//
//  // Print full message.
//  NSLog(@"%@", userInfo);
//}
//
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
//fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
//  // If you are receiving a notification message while your app is in the background,
//  // this callback will not be fired till the user taps on the notification launching the application.
//  // TODO: Handle data of notification
//
//  // With swizzling disabled you must let Messaging know about the message, for Analytics
//  // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
//
//  // Print message ID.
//  if (userInfo[kGCMMessageIDKey]) {
//    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
//  }
//
//  // Print full message.
//  NSLog(@"%@", userInfo);
//
//  completionHandler(UIBackgroundFetchResultNewData);
//}
// [END receive_message]

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

//- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
//  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
//}
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
//fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
//  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//}
//- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
//  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
//}
// [START ios_10_message_handling]
// Receive displayed notifications for iOS 10 devices.
// Handle incoming notification messages while app is in the foreground.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSDictionary *userInfo = notification.request.content.userInfo;
  NSString *const kGCMMessageIDKey = @"gcm.message_id";

  // With swizzling disabled you must let Messaging know about the message, for Analytics
   [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  
  // Print message ID.
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  
  // Print full message.
  NSLog(@"%@", userInfo);
  
  // Change this to your preferred presentation option
  completionHandler(UNNotificationPresentationOptionNone);
}

// Handle notification messages after display notification is tapped by the user.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void(^)(void))completionHandler {
  NSDictionary *userInfo = response.notification.request.content.userInfo;
  NSString *const kGCMMessageIDKey = @"gcm.message_id";

  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  
  // Print full message.
  NSLog(@"%@", userInfo);
  
  completionHandler();
}

// [END ios_10_message_handling]

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
