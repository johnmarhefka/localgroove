import { Firebase } from '@ionic-native/firebase';
import { Component } from '@angular/core';

import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar'
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { ArtistService } from '../services/artist.service';


const FIRST_APP_LOAD_STORAGE_KEY = 'firstAppLoad';

@Component({
  templateUrl: 'app.html',
  providers: [SplashScreen, StatusBar]
})
export class LocalGrooveApp {
  rootPage;

  constructor(platform: Platform, private storage: Storage, private splashScreen: SplashScreen, private statusBar: StatusBar, private firebase: Firebase, private artistService: ArtistService) {
    platform.ready().then(() => {
      this.checkForFirstAppLoad().then(
        (val) => {
          if (val) {
            // It's not their first time here. Carry on to the usual tabs page.
            this.rootPage = TabsPage;

            // Subscribe them to artist notifications if they're an artist but haven't been subscribed yet.
            this.artistService.getArtistEmail().then(
              (val) => {
                if (val) {
                  this.artistService.subscribeToArtistNotifications();
                }
              }
            );
          } else {
            // It's their first time here. Mark that down and then welcome them.
            this.setFirstAppLoad();
            this.rootPage = WelcomePage;
          }
        }
      );

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkForFirstAppLoad(): Promise<boolean> {
    return this.storage.get(FIRST_APP_LOAD_STORAGE_KEY);
  }

  setFirstAppLoad(): void {
    this.storage.set(FIRST_APP_LOAD_STORAGE_KEY, 1);
  }
}
