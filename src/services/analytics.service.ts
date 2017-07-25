import { Injectable } from '@angular/core';

import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@Injectable()
export class AnalyticsService {

    constructor(private firebaseAnalytics: FirebaseAnalytics) { }

    logPageView(params: any) {
        this.firebaseAnalytics.logEvent('page_view', params)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error); // for demo purposes only
    }

}