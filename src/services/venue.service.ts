
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

//TODO: Store these in app settings on the server side and make the call through your service
const CLIENT_ID = '';
const SECRET = '';
//TODO: clean up how this URL is shared
const EXPLORE_URL: string = 'https://api.foursquare.com/v2/venues/explore?client_id=' + CLIENT_ID + '&client_secret=' + SECRET + '&sortByDistance=1&v=20130815&ll=';

// TODO: Needs to be an environment variable of some kind
const TIPPY_SERVICE_URL = 'http://localhost:8080/v2/';

@Injectable()
export class VenueService {

    constructor(private http: Http) { }

    // TODO some of these methods are a little redundant
    private getVenuesAtCoordinates(latitude: number, longitude: number): Promise<any[]> {
        return this.http.get(EXPLORE_URL + latitude + ',' + longitude)
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
    }

    // Gets the single most relevant photo (per the provider) for a given venue.
    getPhotoForVenue(venueId: string): Promise<any> {
        return this.http.get('https://api.foursquare.com/v2/venues/' + venueId + '/photos?limit=1&v=20130815&client_id=' + CLIENT_ID + '&client_secret=' + SECRET)
            .toPromise()
            .then(
            // This drills into the response JSON to get the actual venue photo.
            response => response.json().response.photos.items[0] as any
            )
            .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    // Gets the artist checked in to a particular venue.
    getArtistsAtVenue(venueId: string): Promise<any[]> {
        return this.http.get(TIPPY_SERVICE_URL + 'artistCheckIn/getByVenueId?venueId=' + venueId)
            .toPromise()
            .then(function (response) {
                return response.json() as any[];
            }
            // This drills into the response JSON to get the actual venue photo.
            )
            .catch(this.handleError);
    }

    // Posts a check-in for an artist at a venue.
    checkArtistInToVenue(artistId: string, venueId: string, artistName: string): Promise<any> {
        let artistBeingCheckedIn = {
            "artistId": artistId,
            "venueId": venueId,
            "artistName": artistName,
            "checkInTime": new Date().toISOString()
        }

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(artistBeingCheckedIn);


        // TODO: error handling
        return this.http.post(TIPPY_SERVICE_URL + 'artistCheckIn', body, options)
            .toPromise();
    }

}