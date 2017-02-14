
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { InAppBrowser, InAppBrowserEvent } from 'ionic-native';
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

  ngOnInit(): void {
  }

  // Opens venmo to tip the desired person.
  // TODO: make it actually tip the person you're looking at
  tipTapped(event) {
    let app;

    if (Device.device.platform === 'iOS') {
      app = 'venmo://';
    } else if (Device.device.platform === 'Android') {
      app = 'com.venmo';
    }

    AppAvailability.check(app)
      .then(
      function (response) {
        // This seems to only be reached when the app is there.
        let browser = new InAppBrowser('venmo://paycharge?txn=pay&audience=private&recipients=venmo@venmo.com&amount=1&note=You%20guys%20rock', '_system');
      }
      )
      .catch(function (e) {
        // This is (for now) our way of telling if the app isn't there and deciding to launch in a browser.
        let browser = new InAppBrowser('https://venmo.com/?txn=pay&audience=private&recipients=venmo@venmo.com&amount=1&note=You%20guys%20rock!', '_system');
      });

    
  }
}
