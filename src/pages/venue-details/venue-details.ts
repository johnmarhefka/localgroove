
import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { VenueService } from '../../services/venue.service';
import { ArtistService } from '../../services/artist.service';

import { TipPage } from './../tip/tip';


@Component({
  selector: 'venue-details-page',
  templateUrl: 'venue-details.html'
})
export class VenueDetailsPage {

  selectedVenue: any;
  localPhoto: string;
  artists: Array<any>;
  localArtistEmail: string;
  localArtistName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService, private artistService: ArtistService) {
    // If we navigated to this page, we will have an venue available as a nav param
    this.selectedVenue = navParams.data.item.venue;
    this.getVenuePhoto(this.selectedVenue.id);
  }

  ngOnInit(): void {
    this.initializeLocalArtistData();
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

  // Initialize email and name from locally-stored values.
  initializeLocalArtistData(): void {
    this.artistService.getArtistEmail().then((val) => {
      this.localArtistEmail = val;
    });

    this.artistService.getArtistName().then((val) => {
      this.localArtistName = val;
    });
  }

  artistTapped(event, artist) {
    this.navCtrl.push(TipPage, {
      item: artist
    });
  }

  artistCheckInTapped(event) {

    // TODO: some sort of confirmation here
    // TODO don't show the artist check-in button at all if they're already checked in here under their current ID

    this.venueService.checkArtistInToVenue(this.localArtistEmail, this.selectedVenue.id, this.localArtistName)
      .then((res) => {
        this.artists[this.artists.length] = {
          "id": this.localArtistEmail,
          "name": this.localArtistName
        };
      });


    //TODO: If they don't have artist info yet we need to redirect them to the artist setup page here.
    //this.navCtrl.push(ArtistPage, {});
  }

}
