import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { NearbyPage } from '../pages/nearby/nearby';
import { TipPage } from '../pages/tip/tip';
import { VenueDetailsPage } from '../pages/venue-details/venue-details';
import { TabsPage } from '../pages/tabs/tabs';

import { VenueService } from '../services/venue.service';
import { PaymentService } from '../services/payment.service';

@NgModule({
  declarations: [
    MyApp,
    NearbyPage,
    TipPage,
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
    TipPage,
    AboutPage,
    ContactPage,
    TabsPage,
    VenueDetailsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, VenueService, PaymentService]
})
export class AppModule {}
