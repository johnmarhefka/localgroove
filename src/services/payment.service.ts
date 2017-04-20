import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';

@Injectable()
export class PaymentService {

    constructor(private http: Http) { }

    getPayUrl(artistId: any, tipAmount: number, comments: string, appAvailability: AppAvailability, device: Device): Promise<any> {
        return this.getAppAvailability(appAvailability, device).then(
            function (response) {  // Success callback
                return 'venmo://paycharge?txn=pay&audience=private&recipients=' + artistId + '&amount=' + tipAmount + (comments ? '&note=' + encodeURI(comments) : '');
            },
            function (response) {  // Error callback
                return 'https://venmo.com/?txn=pay&audience=private&recipients=' + artistId + '&amount=' + tipAmount + (comments ? '&note=' + encodeURI(comments) : '');
            }
        );
    }

    getAppAvailability(appAvailability: AppAvailability, device: Device): Promise<boolean> {
        let app;

        if (device.platform === 'iOS') {
            app = 'venmo://';
        } else if (device.platform === 'Android') {
            app = 'com.venmo';
        }

        return appAvailability.check(app);
    }

    getAppDownloadUrl(device: Device): string {
        if (device.platform === 'iOS') {
            return 'https://itunes.apple.com/us/app/venmo/id351727428';
        } else if (device.platform === 'Android') {
            return 'https://play.google.com/store/apps/details?id=com.venmo';
        }
    }

}