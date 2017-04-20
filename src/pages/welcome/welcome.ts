import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';

import { TabsPage } from './../tabs/tabs';
import { ArtistPage } from './../artist/artist';

import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
  providers: [AppAvailability, InAppBrowser, Device]
})
export class WelcomePage {
  paymentAppButtonHidden: boolean = true;
  paymentAppConfirmationHidden: boolean = true;

  constructor(public navCtrl: NavController, private paymentService: PaymentService, public loading: LoadingController, private inAppBrowser: InAppBrowser, private appAvailability: AppAvailability, private device: Device) { }

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
        this.paymentAppButtonHidden = true;
        this.paymentAppConfirmationHidden = false;
        if (loader)
          loader.dismiss();
      },
      (negativeResponse) => { // Error callback
        this.paymentAppButtonHidden = false;
        this.paymentAppConfirmationHidden = true;
        if (loader)
          loader.dismiss();
      }
    );
  }

  getVenmoTapped(event) {
    this.inAppBrowser.create(this.paymentService.getAppDownloadUrl(this.device), '_system')
  }

  imAnArtistTapped(event) {
    this.navCtrl.push(ArtistPage);
  }

  getStartedTapped(event) {
    this.navCtrl.push(TabsPage);
  }
}
