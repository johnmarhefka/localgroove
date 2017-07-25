
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Toast } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import { VenueService } from '../../services/venue.service';
import { AnalyticsService } from '../../services/analytics.service';

import { VenueDetailsPage } from './../venue-details/venue-details';


@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html',
  providers: [Geolocation]
})
export class NearbyPage {

  venues: Array<any>;
  latitude: number = null; // 39.2763;
  longitude: number = null; // -76.6141;
  hideLoadingSpinner: boolean = true;
  searchTerm: string = '';
  toast: Toast;

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService, private analyticsService: AnalyticsService, private geolocation: Geolocation, private toastCtrl: ToastController) { }

  ngOnInit(): void {
    this.hideLoadingSpinner = false;
    this.logPageView();
    this.getVenuesAtCurrentPosition();
  }

  ionViewWillLeave() {
    if (this.toast) {
      this.toast.dismiss();
    }
  }

  // Get current location and pass it along to a function that calls the VenueService.
  getVenuesAtCurrentPosition(refresher?) {
    // If we already have a lat/long, we don't want to keep on locating the device during a single view of the page.
    if (this.latitude && this.longitude) {
      this.getVenues(this.latitude, this.longitude, refresher);
    } else {
      this.geolocation.getCurrentPosition({ timeout: 10000 }).then((resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.getVenues(resp.coords.latitude, resp.coords.longitude, refresher);
      }).catch((error) => {
        console.log('Error getting location', error);
        this.throwOfflineError(refresher);
      });
    }
  }

  getVenues(latitude: number, longitude: number, refresher?): void {
    this.venueService.getNearbyVenues(latitude, longitude, this.searchTerm).then(venues => {
      this.venues = venues;
      this.hideLoadingSpinner = true;
      if (refresher)
        refresher.complete();
    }).then(val => {
      for (let venue of this.venues) {
        this.checkForArtistsAtVenues(venue);
      }
    }).catch((error) => {
      console.log('Error getting nearby venues', error);
      this.throwOfflineError(refresher);
    });
  }


  checkForArtistsAtVenues(venue: any): void {
    this.venueService.checkForArtistsAtVenue(venue.id).then(response => {
      venue.hasArtist = response ? true : false;
    }).catch((error) => {
      console.log('Error checking for artist at venue.', error);
    });
  }

  venueTapped(event, venue) {
    this.navCtrl.push(VenueDetailsPage, {
      item: venue
    });
  }

  // Event for the pull-down-to-refresh.
  doRefresh(refresher) {
    // We want this (unlike a search) to do a fresh locate of the device.
    this.latitude = null;
    this.longitude = null;
    this.hideLoadingSpinner = true;
    if (this.toast)
      this.toast.dismiss();
    this.getVenuesAtCurrentPosition(refresher);
  }

  // Event for venue search.
  onSearchInput(event) {
    this.venues = null;
    this.hideLoadingSpinner = false;
    if (this.toast)
      this.toast.dismiss();
    this.getVenuesAtCurrentPosition();
  }

  throwOfflineError(refresher?) {
    this.toast = this.toastCtrl.create({
      message: "Couldn't find any venues. Sorry. Are you online and allowing Local Groove to access your location?",
      cssClass: "toast-danger",
      duration: 10000,
      position: 'middle'
    });

    this.toast.present();

    this.venues = [];
    this.hideLoadingSpinner = true;
    if (refresher)
      refresher.complete();
  }

  logPageView() {
    this.analyticsService.setCurrentScreen('nearby');
    this.analyticsService.logPageView({ page: "nearby" });
  }

}
