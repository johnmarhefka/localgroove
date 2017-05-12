
import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { VenueService } from '../../services/venue.service';
import { ArtistService } from '../../services/artist.service';

import { TipPage } from './../tip/tip';
import { ArtistPage } from './../artist/artist';


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
  hideCheckInButton: boolean = true;
  hideTipButtons: boolean = true;
  hideLoadingSpinner: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService, private artistService: ArtistService, private alertCtrl: AlertController) {
    // If we navigated to this page, we will have an venue available as a nav param
    this.selectedVenue = navParams.data.item;
    this.getVenuePhoto(this.selectedVenue.id);
  }

  // As compared to ngOnInit(), this is called every time this page loads; even when you come "Back" to it
  ionViewWillEnter() {
    this.hideLoadingSpinner = false;
    this.hideCheckInButton = true;
    this.hideTipButtons = true;
    this.initializePage();
  }

  initializePage(refresher?) {
    this.initializeLocalArtistEmail()
      .then((val) => {
        this.initializeLocalArtistName();
        this.localArtistEmail = val;
        this.getArtists(this.selectedVenue.id, refresher);
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

  getArtists(venueId: string, refresher?): void {
    this.venueService.getArtistsAtVenue(venueId).then(artists => {
      this.artists = artists;
      if (this.artists.length < 10) {
        // Find out if the current artist is already checked in here. If they are, don't even show the button to check in.
        let artistFound = false;
        if (this.localArtistEmail) {
          for (var i = 0; i < artists.length; i++) {
            if (artists[i].id == this.localArtistEmail) {
              artistFound = true;
            }
          }
        }
        if (!artistFound) {
          this.hideCheckInButton = false;
        }
      } else {
        // If there are already 10 people checked in here, put a stop to the madness.
        this.hideCheckInButton = true;
      }
      this.hideLoadingSpinner = true;
      this.hideTipButtons = false;
      if (refresher)
        refresher.complete();
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
    if (this.localArtistEmail && this.localArtistName) {
      let confirm = this.alertCtrl.create({
        title: "You're playing here?",
        buttons: [
          {
            text: 'Nope.'
          },
          {
            text: 'Yep!',
            handler: () => {
              this.checkArtistIn();
            }
          }
        ]
      });
      confirm.present();
    } else {
      // They're not set up as an artist, so send 'em to the artist info page.
      this.navCtrl.push(ArtistPage, {});
    }
  }

  // Event for the pull-down-to-refresh.
  doRefresh(refresher) {
    this.hideLoadingSpinner = true;
    this.initializePage(refresher);
  }

  checkArtistIn() {
    this.hideCheckInButton = true;
    this.hideLoadingSpinner = false;
    this.venueService.checkArtistInToVenue(this.localArtistEmail, this.selectedVenue.id, this.localArtistName)
      .then((res) => {
        this.artists[this.artists.length] = {
          "id": this.localArtistEmail,
          "name": this.localArtistName
        };
        this.hideLoadingSpinner = true;
      });
  }

}
