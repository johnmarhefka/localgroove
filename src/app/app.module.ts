import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ArtistPage } from '../pages/artist/artist';
import { NearbyPage } from '../pages/nearby/nearby';
import { TipPage } from '../pages/tip/tip';
import { VenueDetailsPage } from '../pages/venue-details/venue-details';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';

import { VenueService } from '../services/venue.service';
import { ArtistService } from '../services/artist.service';

@NgModule({
  declarations: [
    MyApp,
    NearbyPage,
    TipPage,
    AboutPage,
    ArtistPage,
    TabsPage,
    VenueDetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NearbyPage,
    TipPage,
    AboutPage,
    ArtistPage,
    TabsPage,
    VenueDetailsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, VenueService, ArtistService, Storage]
})
export class AppModule {}
