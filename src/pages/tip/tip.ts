import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';

import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'page-tip',
  templateUrl: 'tip.html',
  providers: [AppAvailability, InAppBrowser, Device]
})
export class TipPage {
  artist: any;
  tipAmount: number = 5;
  comments: string;
  localPhoto: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private paymentService: PaymentService, private inAppBrowser: InAppBrowser, private appAvailability: AppAvailability, private device: Device) {
    this.artist = navParams.data.artist;
    this.localPhoto = navParams.data.venuePhoto;
  }

  ngOnInit(): void { }

  // Opens venmo to tip the desired person.
  tipTapped(event) {
    this.paymentService.getPayUrl(this.artist.id, this.tipAmount, this.comments, this.appAvailability, this.device).then(
      payUrl => {
        this.inAppBrowser.create(payUrl, '_system')
      }
    );
  }
}
