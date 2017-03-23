import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, private paymentService: PaymentService) {
    // Check if they have the payment app installed.
    this.paymentService.getAppAvailability().then(
      (positiveResponse) => { // Success callback (they have the payment app)
        this.paymentAppButtonHidden = true;
        this.paymentAppConfirmationHidden = false;
      },
      (negativeResponse) => { // Error callback
        this.paymentAppButtonHidden = false;
        this.paymentAppConfirmationHidden = true;
      }
    );
  }

  ngOnInit(): void { }

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
