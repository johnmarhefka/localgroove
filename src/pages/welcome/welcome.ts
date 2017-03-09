import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TabsPage } from './../tabs/tabs';
import { ArtistPage } from './../artist/artist';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController) {
  }

  ngOnInit(): void {
  }

  getVenmoTapped(event) {
    // TODO: Use an in-app browser to send this to get venmo once you've determined how to detect device
    this.navCtrl.push(TabsPage);
  }

  imAnArtistTapped(event) {
    this.navCtrl.push(ArtistPage);
  }

  // Opens venmo to tip the desired person.
  // TODO: make it actually tip the person you're looking at
  getStartedTapped(event) {
    this.navCtrl.push(TabsPage);
  }
}
