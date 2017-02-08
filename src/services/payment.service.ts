
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {PayPal, PayPalPayment, PayPalConfiguration} from "ionic-native";

@Injectable()
export class PaymentService {

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        debugger;
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}