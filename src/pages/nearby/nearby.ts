
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { VenueService } from '../../services/venue.service';
import { VenueDetailsPage } from './../venue-details/venue-details';


@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html'
})
export class NearbyPage {

  venues: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService, public loading: LoadingController) { }

  ngOnInit(): void {
    let loader = this.loading.create();

    loader.present().then(() => {
      this.getVenuesAtCurrentPosition(null, loader);
    });
  }

  // Get current location and pass it along to a function that calls the VenueService.
  getVenuesAtCurrentPosition(refresher?, loader?) {
    // Hard-coded lat/longs for testing.
    // let lat = 39.2821;
    // let long = -76.5916;
    // // lat += Math.random();
    // // long += Math.random();
    // this.getVenues(lat, long, refresher);

    Geolocation.getCurrentPosition().then((resp) => {
      this.getVenues(resp.coords.latitude, resp.coords.longitude, refresher, loader);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getVenues(latitude: number, longitude: number, refresher?, loader?): void {
    this.venueService.getNearbyVenues(latitude, longitude).then(venues => {
      this.venues = venues;
      if (loader)
        loader.dismiss();
      if (refresher)
        refresher.complete();
    });
  }

  venueTapped(event, venue) {
    this.navCtrl.push(VenueDetailsPage, {
      item: venue
    });
  }

  // Event for the pull-down-to-refresh.
  doRefresh(refresher) {
    this.getVenuesAtCurrentPosition(refresher);;
  }

}
