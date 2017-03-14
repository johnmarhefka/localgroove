
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { InAppBrowser } from 'ionic-native';
import { AppAvailability, Device } from 'ionic-native';

@Component({
  selector: 'page-tip',
  templateUrl: 'tip.html'
})
export class TipPage {

  artist: any;
  tipAmount: number = 1;
  comments: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.artist = navParams.data.item;
  }

  ngOnInit(): void { }

  getPayUrl(): Promise<any> {
    let app;

    if (Device.device.platform === 'iOS') {
      app = 'venmo://';
    } else if (Device.device.platform === 'Android') {
      app = 'com.venmo';
    }

    return AppAvailability.check(app)
      .then(
      // This seems to only be reached when the app is there.
      response => 'venmo://paycharge?txn=pay&audience=private&recipients=' as any
      )
      .catch(function (e) {
        // This is (for now) our way of telling if the app isn't there and deciding to launch in a browser.
        response => 'https://venmo.com/?txn=pay&audience=private&recipients&recipients=' as any
      });
  }

  // Opens venmo to tip the desired person.
  // TODO: make it actually tip the person you're looking at
  tipTapped(event) {
    this.getPayUrl().then(
      payUrl => { let browser = new InAppBrowser(payUrl + this.artist.id + '&amount=' + this.tipAmount + '&note=' + encodeURI(this.comments), '_system') }
    );
  }
}
