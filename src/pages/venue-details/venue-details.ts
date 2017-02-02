import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { VenueService } from '../../services/venue.service';


@Component({
  selector: 'venue-details-page',
  templateUrl: 'venue-details.html'
})
export class VenueDetailsPage {

  selectedVenue: any;
  localPhoto: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private venueService: VenueService) {
    // If we navigated to this page, we will have an venue available as a nav param
    this.selectedVenue = navParams.data.item.venue;
    this.getVenuePhoto(this.selectedVenue.id);
  }

  ngOnInit(): void {
  }

  getVenuePhoto(venueId: string): void {
    this.venueService.getPhotoForVenue(venueId).then(venuePhoto => {
      debugger;
      this.localPhoto = (venuePhoto.prefix + 'original' + venuePhoto.suffix);
      //console.log(venuePhoto.prefix + 'original' + venuePhoto.suffix);
    });
  }


}
