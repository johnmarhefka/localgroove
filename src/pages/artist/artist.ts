
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html'
})
export class ArtistPage {

  artistEmail: string;
  artistName: string;

  constructor(public navCtrl: NavController, private storage: Storage, private artistService: ArtistService) { }

  ngOnInit(): void {
    // Initialize email and name from locally-stored values.
    this.artistService.getArtistEmail().then((val) => {
      this.artistEmail = val;
    });

    this.artistService.getArtistName().then((val) => {
      this.artistName = val;
    });
  }

  saveArtistEmail(): void {
    this.artistService.setArtistEmail(this.artistEmail);
  }

  saveArtistName(): void {
    this.artistService.setArtistName(this.artistName);
  }
}
