
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

const ARTIST_EMAIL_LOCAL_STORAGE_KEY: string = "artistEmail";
const ARTIST_NAME_LOCAL_STORAGE_KEY: string = "artistName";

@Injectable()
export class ArtistService {

    constructor(private http: Http, private storage: Storage) { }

    getArtistEmail(): Promise<any> {
        return this.storage.get(ARTIST_EMAIL_LOCAL_STORAGE_KEY)
            .catch(this.handleError);
    }

    setArtistEmail(email: string) {
        this.storage.set(ARTIST_EMAIL_LOCAL_STORAGE_KEY, email);
    }

    //TODO: URL decode on the way out
    getArtistName(): Promise<any> {
        return this.storage.get(ARTIST_NAME_LOCAL_STORAGE_KEY)
            .catch(this.handleError);
    }

    //TODO: URL encode on the way in
    setArtistName(artistName: string) {
        this.storage.set(ARTIST_NAME_LOCAL_STORAGE_KEY, artistName);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}