import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';

import { TabsPage } from './../tabs/tabs';

import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'page-paymentAppCheck',
  templateUrl: 'paymentAppCheck.html',
  providers: [AppAvailability, InAppBrowser, Device, Geolocation]
})
export class PaymentAppCheckPage {

  isArtist: boolean = false;
  listHeader: string = "Checking for location and Venmo...";
  buttonsHidden: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private paymentService: PaymentService, public loading: LoadingController, private inAppBrowser: InAppBrowser, private appAvailability: AppAvailability, private device: Device, private alertCtrl: AlertController, private toastCtrl: ToastController, private geolocation: Geolocation) {
    this.isArtist = navParams.data.isArtist;
  }

  // As compared to ngOnInit(), this is called every time this page loads; even when you come "Back" to it
  ionViewWillEnter() {
    let loader = this.loading.create();

    loader.present().then(() => {
      // This is just being called as part of the setup to make the device ask if the app can use its location.
      this.geolocation.getCurrentPosition().then((resp) => {
        // Now check for payment app availability.
        this.checkAppAvailability(loader);
      }).catch((error) => {
        console.log('Error getting location', error);
        // Even in the error case, we still want to move on to check for app availability.
        this.checkAppAvailability(loader);
      });
    });
  }


  // Checks if they have the payment app installed.
  checkAppAvailability(loader?): void {
    this.paymentService.getAppAvailability(this.appAvailability, this.device).then(
      (positiveResponse) => { // Success callback (they have the payment app)
        if (loader)
          loader.dismiss();
        this.redirectToNext(true);
      },
      (negativeResponse) => { // Error callback
        if (loader)
          loader.dismiss();
        this.listHeader = "You'll need Venmo for tips.";
        this.buttonsHidden = false;
      }
    );
  }

  // Give them a toast message and send them to the artist page if they're an artist, venues page if they're a tipper
  redirectToNext(showToast: boolean) {
    if (this.isArtist) {
      this.navCtrl.setRoot(TabsPage, {
        showArtistPage: true
      });
    } else {
      if (showToast) {
        this.presentToast();
      }
      this.navCtrl.setRoot(TabsPage);
    }
  }

  getVenmoTapped(event) {
    this.inAppBrowser.create(this.paymentService.getAppDownloadUrl(this.device), '_system');
    // While they're getting Venmo, send them along to the next step behind the scenes.
    this.redirectToNext(false);
  }

  skipTapped(event) {
    // This means they don't have venmo and they don't care. Ask if they're sure, and if they are, send them to venues page (regardless of role)
    let confirm = this.alertCtrl.create({
      title: "You'll need Venmo. Skip for now?",
      buttons: [
        {
          text: 'No, wait!'
        },
        {
          text: 'Yep.',
          handler: () => {
            this.navCtrl.push(TabsPage)
          }
        }
      ]
    });
    confirm.present();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'You already have Venmo. All set!',
      duration: 3000,
      cssClass: "toast-success",
      position: 'middle'
    });

    toast.present();
  }
}
