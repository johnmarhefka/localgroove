import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { NearbyPage } from '../nearby/nearby';
import { ArtistPage } from '../artist/artist';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = NearbyPage;
  tab2Root: any = ArtistPage;
  showArtistPage: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.showArtistPage = navParams.data.showArtistPage;
  }
}
