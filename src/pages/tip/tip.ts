import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'page-tip',
  templateUrl: 'tip.html'
})
export class TipPage {
  artist: any;
  tipAmount: number = 1;
  comments: string;
  localPhoto: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private paymentService: PaymentService) {
    this.artist = navParams.data.artist;
    this.localPhoto = navParams.data.venuePhoto;
  }

  ngOnInit(): void { }

  // Opens venmo to tip the desired person.
  tipTapped(event) {
    this.paymentService.getPayUrl(this.artist.id, this.tipAmount, this.comments).then(
      payUrl => {
        new InAppBrowser(payUrl, '_system')
      }
    );
  }
}
