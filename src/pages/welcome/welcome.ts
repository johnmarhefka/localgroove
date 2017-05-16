import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PaymentAppCheckPage } from './../paymentAppCheck/paymentAppCheck';


@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  constructor(public navCtrl: NavController) { }

  imAFanTapped(event) {
    this.navCtrl.push(PaymentAppCheckPage, {
      isArtist: false
    });
  }

  imAnArtistTapped(event) {
    this.navCtrl.push(PaymentAppCheckPage, {
      isArtist: true
    });
  }

  imBothTapped(event) {
    this.navCtrl.push(PaymentAppCheckPage, {
      isArtist: true
    });
  }
}
