import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, ToastController, Toast } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { VenueService } from '../../services/venue.service';
import { ArtistService } from '../../services/artist.service';
import { AnalyticsService } from '../../services/analytics.service';

import { TipPage } from './../tip/tip';
import { ArtistPage } from './../artist/artist';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

const RECENT_CHECKIN_KEY = 'recentCheckins';
const RECENT_CHECKIN_TIMEFRAME_IN_HOURS = 1;
const RECENT_CHECKINS_ALLOWED = 5;

@Component({
  selector: 'venue-details-page',
  templateUrl: 'venue-details.html',
  providers: [Facebook]
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService, private artistService: ArtistService, private analyticsService: AnalyticsService, private alertCtrl: AlertController, private storage: Storage, private toastCtrl: ToastController, private fb: Facebook) {
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
          this.presentNobodyPlayingToast();
        }
      } else {
        // If there are already 10 people checked in here, put a stop to the madness.
        this.hideCheckInButton = true;
      }
      this.hideLoadingSpinner = true;
      this.hideTipButtons = false;
      if (refresher)
        refresher.complete();
      this.logPageView();
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
      venuePhoto: this.localPhoto,
      venue: this.selectedVenue
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
              this.initializeArtistCheckin();
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

  facebookTapped(event) {


    this.fb.showDialog({
      method: 'share',
      picture: 'https://www.localgrooveapp.com/tippy_icon-square.png',
      href: 'https://localgrooveapp.com/venue.html?venueId=' + encodeURI(this.selectedVenue.id) + '&venueName=' + encodeURI(this.selectedVenue.name),
      // title: 'Title.',
      // hashtag: '#supportlocalmusic',
      // data: "thedata",
      // title: "theTitle",
      // description: 'Much description',
      
    });

  }

  // Event for the pull-down-to-refresh.
  doRefresh(refresher) {
    if (this.toast) {
      this.toast.dismiss();
    }
    this.hideLoadingSpinner = true;
    this.initializePage(refresher);
  }

  // Checks if the user has been checking in too rapidly, and if not, checks them in as an artist at this venue.
  initializeArtistCheckin() {
    this.storage.get(RECENT_CHECKIN_KEY).then(
      (recentCheckinsFromLocalStorage) => {

        let recentCheckins = [];
        let rightNow = new Date();

        if (!recentCheckinsFromLocalStorage) {
          // This is clearly their first check-in, so make record of it and send them on their way as innocent.
          recentCheckins.push(rightNow);
          this.storage.set(RECENT_CHECKIN_KEY, recentCheckins);
          this.checkArtistIn();
        } else {
          // Pull down recent checkins.
          recentCheckins = recentCheckins.concat(recentCheckinsFromLocalStorage);

          let newRecentCheckins = [];
          // Loop through their check-ins, putting those that were recent enough into a new array.
          for (var i = 0; i < recentCheckins.length; i++) {
            let currentCheckin = new Date(recentCheckins[i]);
            let cutoffTime = new Date();
            cutoffTime.setHours(rightNow.getHours() - RECENT_CHECKIN_TIMEFRAME_IN_HOURS);
            if (currentCheckin > cutoffTime) {
              // This checkin was more recent than the cutoff time, so count it.
              newRecentCheckins.push(currentCheckin);
            }
          }

          if (newRecentCheckins.length < RECENT_CHECKINS_ALLOWED) {
            // They haven't checked in too many times, so count this check-in and let them move along.
            newRecentCheckins.push(rightNow);
            this.storage.set(RECENT_CHECKIN_KEY, newRecentCheckins);
            this.checkArtistIn();
          } else {
            // Too many check-ins. Show a toast and don't check them in.
            this.presentTooManyCheckinsToast();
          }
        }
      }
    );



  }

  // Uses the Venue service to actually check the artist in.
  checkArtistIn() {
    this.hideCheckInButton = true;
    this.hideLoadingSpinner = false;
    this.analyticsService.logEvent("artist_checkin", { venueId: this.selectedVenue.id, venueName: this.selectedVenue.name, lat: this.selectedVenue.location.lat, lng: this.selectedVenue.location.lng, artistEmail: this.localArtistEmail, artistName: this.localArtistName });
    this.venueService.checkArtistInToVenue(this.localArtistEmail, this.selectedVenue.id, this.localArtistName)
      .then((res) => {
        this.artists[this.artists.length] = {
          "id": this.localArtistEmail,
          "name": this.localArtistName
        };
        this.hideLoadingSpinner = true;
      });
  }

  presentNobodyPlayingToast() {
    this.toast = this.toastCtrl.create({
      message: "No artists are checked in here. Bummer.",
      cssClass: "toast-neutral",
      duration: 10000,
      position: 'middle'
    });

    this.toast.present();
  }

  presentTooManyCheckinsToast() {
    this.toast = this.toastCtrl.create({
      message: "Pump the brakes. You can't play everywhere at once!",
      cssClass: "toast-danger",
      duration: 3000,
      position: 'middle'
    });

    this.toast.present();
  }

  logPageView() {
    this.analyticsService.setCurrentScreen('venue-details');
    this.analyticsService.logPageView({ page: "venue-details", venueId: this.selectedVenue.id, venueName: this.selectedVenue.name, lat: this.selectedVenue.location.lat, lng: this.selectedVenue.location.lng });
  }
}
