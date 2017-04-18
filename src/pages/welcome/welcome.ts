import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { TabsPage } from './../tabs/tabs';
import { ArtistPage } from './../artist/artist';

import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  paymentAppButtonHidden: boolean = true;
  paymentAppConfirmationHidden: boolean = true;

  constructor(public navCtrl: NavController, private paymentService: PaymentService, public loading: LoadingController) { }

  ngOnInit(): void {
    let loader = this.loading.create();
    loader.present().then(() => {
      this.checkAppAvailability(loader);
    });
  }

  // Checks if they have the payment app installed.
  checkAppAvailability(loader?): void {
    this.paymentService.getAppAvailability().then(
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
    new InAppBrowser(this.paymentService.getAppDownloadUrl(), '_system')
  }

  imAnArtistTapped(event) {
    this.navCtrl.push(ArtistPage);
  }

  getStartedTapped(event) {
    this.navCtrl.push(TabsPage);
  }
}
