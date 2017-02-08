
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-tip',
  templateUrl: 'tip.html'
})
export class TipPage {

  artist: any;
  tipAmount: number = 1;
  comments: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.artist = navParams.data.item;
  }

  ngOnInit(): void {
  }

}
