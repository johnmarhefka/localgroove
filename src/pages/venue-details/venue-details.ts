import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { VenueService } from '../../services/venue.service';
import { TipPage } from './../tip/tip';


@Component({
  selector: 'venue-details-page',
  templateUrl: 'venue-details.html'
})
export class VenueDetailsPage {

  selectedVenue: any;
  localPhoto: string;
  artists: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService) {
    // If we navigated to this page, we will have an venue available as a nav param
    this.selectedVenue = navParams.data.item.venue;
    this.getVenuePhoto(this.selectedVenue.id);
  }

  ngOnInit(): void {
    this.getArtists(this.selectedVenue.id);
  }

  getVenuePhoto(venueId: string): void {
    this.venueService.getPhotoForVenue(venueId).then(venuePhoto => {
      this.localPhoto = (venuePhoto.prefix + 'original' + venuePhoto.suffix);
    });
  }

  getArtists(venueId: string): void {
    this.venueService.getArtistsAtVenue(venueId).then(artists => {
      this.artists = artists;
    });
  }

  artistTapped(event, artist) {
    this.navCtrl.push(TipPage, {
      item: artist
    });
  }

}
