import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AppAvailability, Device } from 'ionic-native';

@Injectable()
export class PaymentService {

    constructor(private http: Http) { }

    getPayUrl(artistId: any, tipAmount: number, comments: string): Promise<any> {
        return this.getAppAvailability().then(
            function (response) {  // Success callback
                return 'venmo://paycharge?txn=pay&audience=private&recipients=' + artistId + '&amount=' + tipAmount + (comments ? '&note=' + encodeURI(comments) : '');
            },
            function (response) {  // Error callback
                return 'https://venmo.com/?txn=pay&audience=private&recipients=' + artistId + '&amount=' + tipAmount + (comments ? '&note=' + encodeURI(comments) : '');
            }
        );
    }

    getAppAvailability(): Promise<boolean> {
        let app;

        if (Device.device.platform === 'iOS') {
            app = 'venmo://';
        } else if (Device.device.platform === 'Android') {
            app = 'com.venmo';
        }

        return AppAvailability.check(app);
    }

    getAppDownloadUrl(): string {
        if (Device.device.platform === 'iOS') {
            return 'https://itunes.apple.com/us/app/venmo/id351727428';
        } else if (Device.device.platform === 'Android') {
            return 'https://play.google.com/store/apps/details?id=com.venmo';
        }
    }

}