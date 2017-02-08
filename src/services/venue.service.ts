
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

//TODO: Where does one normally store stuff like these values?
const CLIENT_ID = 'YB4IJ2JMZ5V3EFJCVHHLSPCJCRR4Z5PZQ4FXUP0LLL0QWAVD';
const SECRET = '5LFOE0TBL5SSC0GZXPDYRP201L3ZNQDFOPMFDIPFGWGRY3JX';
//TODO: clean up how this URL is shared
const EXPLORE_URL: string = 'https://api.foursquare.com/v2/venues/explore?client_id=' + CLIENT_ID + '&client_secret=' + SECRET + '&sortByDistance=1&v=20130815&ll=';

const ARTISTS_AT_VENUE =
    [
        {
            "id": "1234",
            "name": "Katie Bowers Band"
        },
        {
            "id": "5678",
            "name": "Billy Thomson Band"
        }
    ]

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
        debugger;
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    // Gets the artist checked in to a particular venue.
    //TODO make this return a promise, call an actual service, etc.
    getArtistsAtVenue(venueId: string): Array<any> {
        return ARTISTS_AT_VENUE;
    }

    // Posts a check-in for an artist at a venue.
    checkArtistInToVenue(venueId: string, artistId: string): Promise<any> {
        return Promise.reject('not implemented');
    }

}