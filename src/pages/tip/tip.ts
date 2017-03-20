
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
  localPhoto: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.artist = navParams.data.artist;
    this.localPhoto = navParams.data.venuePhoto;
  }

  ngOnInit(): void { }

  getPayUrl(): Promise<any> {
    let app;

    if (Device.device.platform === 'iOS') {
      app = 'venmo://';
    } else if (Device.device.platform === 'Android') {
      app = 'com.venmo';
    }

    return AppAvailability.check(app).then(
      function (response) {  // Success callback
        return 'venmo://paycharge?txn=pay&audience=private&recipients=';
      },
      function (response) {  // Error callback
        return 'https://venmo.com/?txn=pay&audience=private&recipients=';
      }
    );


  }


  // Opens venmo to tip the desired person.
  tipTapped(event) {
    this.getPayUrl().then(
      payUrl => {
        new InAppBrowser(payUrl + this.artist.id + '&amount=' + this.tipAmount + (this.comments ? '&note=' + encodeURI(this.comments) : ''), '_system')
      }
    );
  }
}
