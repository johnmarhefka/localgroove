
import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, ToastController, Toast } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { VenueService } from '../../services/venue.service';
import { ArtistService } from '../../services/artist.service';

import { TipPage } from './../tip/tip';
import { ArtistPage } from './../artist/artist';

const RAPID_CHECKIN_KEY = 'checkinsWithinLastHour';

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
  toast: Toast;

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService, private artistService: ArtistService, private alertCtrl: AlertController, private storage: Storage, private toastCtrl: ToastController) {
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

  ionViewWillLeave() {
    if (this.toast) {
      this.toast.dismiss();
    }
  }

  initializePage(refresher?) {
    this.initializeLocalArtistEmail()
      .then((val) => {
        this.initializeLocalArtistName();
        this.localArtistEmail = val;
        if (!this.localArtistEmail) {
          // Don't show them the check-in button if they're not an artist.
          this.hideCheckInButton = true;
        }
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
          if (!artistFound) {
            this.hideCheckInButton = false;
          }
        } else if (this.artists.length == 0) {
          // If they're not an artist AND there's nobody checked in here, tell them there's nobody home.
          this.presentToast();
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
    
    // if (!this.checkForRapidCheckin()) {
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
    // }
  }

  // Makes sure this user isn't checking in everywhere frantically to be a funny guy.
  checkForRapidCheckin(): boolean {
    let checkinsWithinLastHour = [];

    if (!this.storage.get(RAPID_CHECKIN_KEY)) {
      // If they don't yet have their array of recent check-ins created in local storage, initialize it as empty.
      this.storage.set(RAPID_CHECKIN_KEY, []);
      // This is clearly their first check-in, so make record of it and send them on their way as innocent.
      checkinsWithinLastHour.push(new Date());
      return false;
    } else {

    }

    // Pull down recent checkins.
    checkinsWithinLastHour.push(this.storage.get(RAPID_CHECKIN_KEY));

    // If we got here, they just attempted a check-in, so make record of that.
    checkinsWithinLastHour.push(new Date());

    // Loop through their check-ins, deleting those that were more than an hour ago and counting the total of those that were within the last hour

    // Re-set() the local storage value

    // If the total is too high, return true, AND show a toast message.


    return false;
  }

  presentToast() {
    this.toast = this.toastCtrl.create({
      message: "Nobody is playing here. Bummer.",
      cssClass: "toast-neutral",
      position: 'middle'
    });

    this.toast.present();
  }


}
