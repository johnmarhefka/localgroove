import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Geolocation, Geoposition } from 'ionic-native';


const CLIENT_ID = 'YB4IJ2JMZ5V3EFJCVHHLSPCJCRR4Z5PZQ4FXUP0LLL0QWAVD';
const SECRET = '5LFOE0TBL5SSC0GZXPDYRP201L3ZNQDFOPMFDIPFGWGRY3JX';
const URL: string = 'https://api.foursquare.com/v2/venues/explore?client_id=' + CLIENT_ID + '&client_secret=' + SECRET + '&sortByDistance=1&v=20130815&ll=';//39.174167,-76.811389';

@Injectable()
export class VenueService {

    constructor(private http: Http) { }

    // private getCurrentGeolocation(): Promise<Geoposition> {
    //     return Geolocation.getCurrentPosition();
    // }

    private getVenuesAtCoordinates(latitude: number, longitude: number): Promise<any[]> {
        return this.http.get(URL + latitude + ',' + longitude)
            .toPromise()
            .then(
            // This drills into the response JSON to get the actual venue objects.
            response => response.json().response.groups[0].items as any[]
            )
            .catch(this.handleError);
    }

    getNearbyVenues(latitude: number, longitude: number): Promise<any[]> {



        return this.getVenuesAtCoordinates(latitude, longitude)
            .catch((error) => {
                console.log('Error getting current coordinates!', error);
                return null;
            });

        // return this.getCurrentGeolocation().then(
        //     resp => { 
        //         this.getVenuesAtCoordinates() 
        //     }
        //     )
        //     .catch((error) => {
        //         console.log('Error getting current coordinates!', error);
        //         return null;
        //     });


    }



    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}