import { NgModule, ErrorHandler } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { LocalGrooveApp } from './app.component';
import { ArtistPage } from '../pages/artist/artist';
import { NearbyPage } from '../pages/nearby/nearby';
import { WelcomePage } from '../pages/welcome/welcome';
import { PaymentAppCheckPage } from '../pages/paymentAppCheck/paymentAppCheck';
import { TipPage } from '../pages/tip/tip';
import { VenueDetailsPage } from '../pages/venue-details/venue-details';
import { TabsPage } from '../pages/tabs/tabs';
import { IonicStorageModule } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';

import { VenueService } from '../services/venue.service';
import { ArtistService } from '../services/artist.service';
import { PaymentService } from '../services/payment.service';
import { AnalyticsService } from '../services/analytics.service';

@NgModule({
  declarations: [
    LocalGrooveApp,
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
    IonicModule.forRoot(LocalGrooveApp),
    IonicStorageModule.forRoot(),
    NgPipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LocalGrooveApp,
    NearbyPage,
    WelcomePage,
    PaymentAppCheckPage,
    TipPage,
    ArtistPage,
    TabsPage,
    VenueDetailsPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, VenueService, ArtistService, PaymentService, AnalyticsService, Firebase]
})
export class AppModule { }
