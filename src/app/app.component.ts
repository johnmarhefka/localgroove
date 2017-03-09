import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { Storage } from '@ionic/storage';

const FIRST_APP_LOAD_STORAGE_KEY = 'firstAppLoad';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, private storage: Storage) {
    platform.ready().then(() => {

      this.checkForFirstAppLoad().then(
        (val) => {
          if (val) {
            // It's not their first time here. Carry on to the usual tabs page.
            this.rootPage = TabsPage;
          } else {
            // It's their first time here. Mark that down and then welcome them.
            this.setFirstAppLoad();
            this.rootPage = WelcomePage;
          }
        }
      );

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  checkForFirstAppLoad(): Promise<boolean> {
    return this.storage.get(FIRST_APP_LOAD_STORAGE_KEY);
  }

  setFirstAppLoad(): void {
    this.storage.set(FIRST_APP_LOAD_STORAGE_KEY, 1);
  }
}
