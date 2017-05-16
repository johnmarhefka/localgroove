import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';

import { TabsPage } from './../tabs/tabs';

import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'page-paymentAppCheck',
  templateUrl: 'paymentAppCheck.html',
  providers: [AppAvailability, InAppBrowser, Device]
})
export class PaymentAppCheckPage {

  isArtist: boolean = false;
  listHeader: string = "Checking for Venmo...";
  buttonsHidden: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private paymentService: PaymentService, public loading: LoadingController, private inAppBrowser: InAppBrowser, private appAvailability: AppAvailability, private device: Device, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.isArtist = navParams.data.isArtist;
  }

  ngOnInit(): void {
    let loader = this.loading.create();
    loader.present().then(() => {
      this.checkAppAvailability(loader);
    });
  }

  // Checks if they have the payment app installed.
  checkAppAvailability(loader?): void {
    this.paymentService.getAppAvailability(this.appAvailability, this.device).then(
      (positiveResponse) => { // Success callback (they have the payment app)
        if (loader)
          loader.dismiss();
        this.redirectToNext();
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
  redirectToNext() {
    if (this.isArtist) {
      this.navCtrl.push(TabsPage, {
        showArtistPage: true
      });
    } else {
      this.presentToast();
      this.navCtrl.push(TabsPage);
    }
  }

  getVenmoTapped(event) {
    this.inAppBrowser.create(this.paymentService.getAppDownloadUrl(this.device), '_system')
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
      duration: 2000,
      cssClass: "toast-success",
      position: 'middle'
    });

    toast.present();
  }
}
