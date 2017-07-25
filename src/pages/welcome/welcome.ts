import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PaymentAppCheckPage } from './../paymentAppCheck/paymentAppCheck';

import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  constructor(public navCtrl: NavController, private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.logPageView();
  }

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

  logPageView() {
    this.analyticsService.setCurrentScreen('welcome');
    this.analyticsService.logPageView({ page: "welcome" });
  }
}
