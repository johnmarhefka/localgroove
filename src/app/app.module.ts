import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ArtistPage } from '../pages/artist/artist';
import { NearbyPage } from '../pages/nearby/nearby';
import { WelcomePage } from '../pages/welcome/welcome';
import { PaymentAppCheckPage } from '../pages/paymentAppCheck/paymentAppCheck';
import { TipPage } from '../pages/tip/tip';
import { VenueDetailsPage } from '../pages/venue-details/venue-details';
import { TabsPage } from '../pages/tabs/tabs';
import { IonicStorageModule } from '@ionic/storage';

import { VenueService } from '../services/venue.service';
import { ArtistService } from '../services/artist.service';
import { PaymentService } from '../services/payment.service';

@NgModule({
  declarations: [
    MyApp,
    NearbyPage,
    WelcomePage,
    PaymentAppCheckPage,
    TipPage,
    ArtistPage,
    TabsPage,
    VenueDetailsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NearbyPage,
    WelcomePage,
    PaymentAppCheckPage,
    TipPage,
    ArtistPage,
    TabsPage,
    VenueDetailsPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, VenueService, ArtistService, PaymentService]
})
export class AppModule { }
