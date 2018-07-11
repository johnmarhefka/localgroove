import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';

import { AnalyticsService } from './analytics.service';

const ARTIST_EMAIL_LOCAL_STORAGE_KEY: string = "artistEmail";
const ARTIST_NAME_LOCAL_STORAGE_KEY: string = "artistName";
const ARTIST_NOTIFICATION_TOPIC: string = "artist_notifications";
const ARTIST_NOTIFICATION_TOPIC_SUBSCRIBED_KEY: string = "artist_notifications_subscribed";

@Injectable()
export class ArtistService {

    constructor(private http: Http, private storage: Storage, private firebase: Firebase, private analyticsService: AnalyticsService) { }

    getArtistEmail(): Promise<any> {
        return this.storage.get(ARTIST_EMAIL_LOCAL_STORAGE_KEY)
            .catch(this.handleError);
    }

    setArtistEmail(email: string) {
        this.storage.set(ARTIST_EMAIL_LOCAL_STORAGE_KEY, email);
    }

    getArtistName(): Promise<any> {
        return this.storage.get(ARTIST_NAME_LOCAL_STORAGE_KEY)
            .catch(this.handleError);
    }

    setArtistName(artistName: string) {
        this.storage.set(ARTIST_NAME_LOCAL_STORAGE_KEY, artistName);
    }

    subscribeToArtistNotifications() {
        this.storage.get(ARTIST_NOTIFICATION_TOPIC_SUBSCRIBED_KEY).then(
            (val) => {
                if (!val) {
                    // They haven't been subscribed to this already, so subscribe them.
                    this.storage.set(ARTIST_NOTIFICATION_TOPIC_SUBSCRIBED_KEY, 1);
                    this.firebase.hasPermission().then((data) => {
                        if (!data.isEnabled) {
                            this.firebase.grantPermission();
                        }
                    });
                    this.firebase.subscribe(ARTIST_NOTIFICATION_TOPIC);
                    // TODO in a better way: This is an easter egg for testing notifications on just my device. Deal with it.
                    this.getArtistEmail().then((val) => {
                        if (val == "marhefka.john@gmail.com") {
                            this.firebase.subscribe("john_testing_notifications");
                        }
                    });
                    // Log that they subscribed.
                    this.getArtistName().then((val) => {
                        this.analyticsService.logEvent("artist_notifications_subscribe", { artistName: val });
                    });
                }
            }
        ).catch(this.handleError);;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}