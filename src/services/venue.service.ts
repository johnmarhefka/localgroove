
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

const CLIENT_ID = '';
const SECRET = '';

const TIPPY_API_KEY = '';

//const EXPLORE_URL: string = 'https://api.foursquare.com/v2/venues/explore?client_id=' + CLIENT_ID + '&client_secret=' + SECRET + '&sortByDistance=1&v=20130815&ll=';
const SEARCH_URL: string = 'https://api.foursquare.com/v2/venues/search?client_id=' + CLIENT_ID + '&client_secret=' + SECRET + '&sortByDistance=1&v=20130815&ll=';

const TIPPY_SERVICE_URL = 'https://tippyserver-dev.herokuapp.com/v2/'; // DEV
////const TIPPY_SERVICE_URL = 'https://tippyserver.herokuapp.com/v2/'; // PROD
//const TIPPY_SERVICE_URL = 'http://localhost:5000/v2/'; // Local

@Injectable()
export class VenueService {

    constructor(private http: Http) { }

    private getVenuesAtCoordinates(latitude: number, longitude: number, searchTerm?: string): Promise<any[]> {

        let requestUrl: string = SEARCH_URL + latitude + ',' + longitude;
        // Decide whether to search by a term or just generally explore nearby.
        if (searchTerm && searchTerm.trim() != '') {
            requestUrl += ('&query=' + encodeURI(searchTerm));
        }

        return this.http.get(requestUrl)
            .toPromise()
            .then(function (response) {
                // Dig into the JSON and return the venues.
                return response.json().response.venues as any[]
            }
            )
            .catch(this.handleError);
    }

    getNearbyVenues(latitude: number, longitude: number, searchTerm?: string): Promise<any[]> {
        return this.getVenuesAtCoordinates(latitude, longitude, searchTerm)
            .catch((error) => {
                console.log('Error getting venues at current coordinates!', error);
                throw error;
            });
    }

    // Gets a photo from the provider for a given venue.
    getPhotoForVenue(venueId: string): Promise<any> {
        return this.http.get('https://api.foursquare.com/v2/venues/' + venueId + '/photos?limit=10&v=20130815&client_id=' + CLIENT_ID + '&client_secret=' + SECRET)
            .toPromise()
            .then(
            // This drills into the response JSON to get the actual venue photo.
            response => response.json().response.photos.items[Math.floor(Math.random() * response.json().response.photos.count)] as any
            )
            .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    // Gets the artist checked in to a particular venue. URI decoding is being done by the server.
    getArtistsAtVenue(venueId: string): Promise<any[]> {
        return this.http.get(TIPPY_SERVICE_URL + 'artistCheckIn/getByVenueId?venueId=' + venueId + '&key=' + TIPPY_API_KEY)
            .toPromise()
            .then(function (response) {
                return response.json() as any[];
            }
            // This drills into the response JSON to get the actual venue photo.
            )
            .catch(this.handleError);
    }

    // Posts a check-in for an artist at a venue. URI encodes on the way in.
    checkArtistInToVenue(artistId: string, venueId: string, artistName: string): Promise<any> {
        let artistBeingCheckedIn = {
            "artistId": encodeURI(artistId),
            "venueId": venueId,
            "artistName": encodeURI(artistName),
            "checkInTime": new Date().toISOString()
        }

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(artistBeingCheckedIn);

        return this.http.post(TIPPY_SERVICE_URL + 'artistCheckIn?key=' + TIPPY_API_KEY, body, options)
            .toPromise();
    }

    // Just a way to get the Foursquare client ID being used.
    public getAttributionLinkForVenue(venueId: string) : string {
        return "https://foursquare.com/v/foursquare-hq/" + venueId + "?ref=" + CLIENT_ID;
    }

}