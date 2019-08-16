package com.fetch_client2;

import android.app.Application;

import com.facebook.react.ReactApplication;
<<<<<<< HEAD
<<<<<<< HEAD
import io.invertase.firebase.RNFirebasePackage;
=======
import com.imagepicker.ImagePickerPackage;
>>>>>>> b4ca2d2cb64b4b32a4369e58abd6d9f6e6bb362e
=======
import io.invertase.firebase.RNFirebasePackage;
import com.imagepicker.ImagePickerPackage;
>>>>>>> 206322fe70a7630c26fd9a32246fd915aab68e78
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
<<<<<<< HEAD
<<<<<<< HEAD
            new RNFirebasePackage(),
=======
            new ImagePickerPackage(),
>>>>>>> b4ca2d2cb64b4b32a4369e58abd6d9f6e6bb362e
=======
            new RNFirebasePackage(),
            new ImagePickerPackage(),
>>>>>>> 206322fe70a7630c26fd9a32246fd915aab68e78
            new RNCWebViewPackage(),
            new ReactNativePushNotificationPackage(),
            new AsyncStoragePackage(),
            new RNCViewPagerPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
