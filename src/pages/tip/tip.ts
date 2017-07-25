import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';

import { PaymentService } from '../../services/payment.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'page-tip',
  templateUrl: 'tip.html',
  providers: [AppAvailability, InAppBrowser, Device]
})
export class TipPage {
  artist: any;
  venue: any;
  tipAmount: number = 5;
  comments: string;
  localPhoto: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private paymentService: PaymentService, private analyticsService: AnalyticsService, private inAppBrowser: InAppBrowser, private appAvailability: AppAvailability, private device: Device) {
    this.artist = navParams.data.artist;
    this.venue = navParams.data.venue;
    this.localPhoto = navParams.data.venuePhoto;
  }

  ngOnInit(): void {
    this.logPageView();
  }

  // Opens venmo to tip the desired person.
  tipTapped(event) {
    this.analyticsService.logEvent("tip_initiated", { artistId: this.artist.id, artistName: this.artist.name, tipAmount: this.tipAmount, tipComments: this.comments, venueId: this.venue.id, venueName: this.venue.name, lat: this.venue.location.lat, lng: this.venue.location.lng });
    this.paymentService.getPayUrl(this.artist.id, this.tipAmount, this.comments, this.appAvailability, this.device).then(
      payUrl => {
        this.inAppBrowser.create(payUrl, '_system')
      }
    );
  }

  logPageView() {
    this.analyticsService.setCurrentScreen('tip');
    this.analyticsService.logPageView({ page: "tip", artistId: this.artist.id, artistName: this.artist.name, venueId: this.venue.id, venueName: this.venue.name, lat: this.venue.location.lat, lng: this.venue.location.lng });
  }
}