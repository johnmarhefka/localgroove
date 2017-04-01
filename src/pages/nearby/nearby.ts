
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { VenueService } from '../../services/venue.service';
import { VenueDetailsPage } from './../venue-details/venue-details';


@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html'
})
export class NearbyPage {

  venues: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService) { }

  ngOnInit(): void {

    // This is fake code to get locations in Fells to avoid latency.
    //this.getVenues(39.2821, -76.5916);

    // // Get current location and pass it along to a function that calls the VenueService.
    Geolocation.getCurrentPosition().then((resp) => {
      this.getVenues(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getVenues(latitude: number, longitude: number): void {
    this.venueService.getNearbyVenues(latitude, longitude).then(venues => {
      this.venues = venues;
    });
  }

  venueTapped(event, venue) {
    this.navCtrl.push(VenueDetailsPage, {
      item: venue
    });
  }

}
