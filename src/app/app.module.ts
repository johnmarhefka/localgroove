import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { NearbyPage } from '../pages/nearby/nearby';
import { VenueDetailsPage } from '../pages/venue-details/venue-details';
import { TabsPage } from '../pages/tabs/tabs';

import { VenueService } from '../services/venue.service';

@NgModule({
  declarations: [
    MyApp,
    NearbyPage,
    AboutPage,
    ContactPage,
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
    AboutPage,
    ContactPage,
    TabsPage,
    VenueDetailsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, VenueService]
})
export class AppModule {}
