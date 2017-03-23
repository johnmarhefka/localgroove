
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
  artistAlreadyCheckedIn: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService, private artistService: ArtistService) {
    // If we navigated to this page, we will have an venue available as a nav param
    this.selectedVenue = navParams.data.item.venue;
    this.getVenuePhoto(this.selectedVenue.id);
  }

  ngOnInit(): void {
    // Use promises to make sure the artist doesn't see the check-in button when they're already checked in.
    this.initializeLocalArtistEmail()
      .then((val) => {
        this.initializeLocalArtistName();
        this.localArtistEmail = val;
        this.getArtists(this.selectedVenue.id);
      }
      );
  }

  getVenuePhoto(venueId: string): void {
    this.venueService.getPhotoForVenue(venueId).then(venuePhoto => {
      if (venuePhoto) {
        this.localPhoto = (venuePhoto.prefix + 'original' + venuePhoto.suffix);
      }
    });
  }

  getArtists(venueId: string): void {
    this.venueService.getArtistsAtVenue(venueId).then(artists => {
      this.artists = artists;
      // Find out if the current artist is already checked in here. If they are, don't even show the button to check in.
      let artistFound = false;
      if (this.localArtistEmail) {
        for (var i = 0; i < artists.length; i++) {
          if (artists[i].id == this.localArtistEmail) {
            artistFound = true;
          }
        }
        if (!artistFound) {
          this.artistAlreadyCheckedIn = false;
        }
      }
    });
  }

  initializeLocalArtistEmail(): Promise<any> {
    return this.artistService.getArtistEmail();
  }

  initializeLocalArtistName(): void {
    this.artistService.getArtistName().then((val) => {
      this.localArtistName = val;
    });
  }

  artistTapped(event, artist) {
    this.navCtrl.push(TipPage, {
      artist: artist,
      venuePhoto: this.localPhoto
    });
  }

  artistCheckInTapped(event) {

    // TODO: some sort of confirmation here

    this.venueService.checkArtistInToVenue(this.localArtistEmail, this.selectedVenue.id, this.localArtistName)
      .then((res) => {
        this.artists[this.artists.length] = {
          "id": this.localArtistEmail,
          "name": this.localArtistName
        };
        this.artistAlreadyCheckedIn = true;
      });


    //TODO: If they don't have artist info yet we need to redirect them to the artist setup page here.
    //this.navCtrl.push(ArtistPage, {});
  }

}
