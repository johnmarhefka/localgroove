import { Injectable } from '@angular/core';

import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class AnalyticsService {

    constructor(private firebase: Firebase) { }

    logPageView(params: any) {
        this.firebase.logEvent('page_view', params)
            .catch(this.handleError);
    }

    logEvent(name: string, params: any) {
         this.firebase.logEvent(name, params)
            .catch(this.handleError);
    }

    setCurrentScreen(name: string) {
        this.firebase.setScreenName(name)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error); // for demo purposes only
    }
}