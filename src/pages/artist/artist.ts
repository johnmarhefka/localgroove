
import { Component } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms'

import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { ArtistService } from '../../services/artist.service';


@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html'
})
export class ArtistPage {

  artistForm: FormGroup;
  artistEmail: string;
  artistName: string;
  fieldsRequiredMessageHidden: boolean = true;

  formErrors = {
    'name': [],
    'email': []
  };

  validationMessages = {
    'email': {
      'pattern': 'Invalid email address.'
    },
    'name': {
      'required': 'Please enter an Artist Name.'
    }
  }

  constructor(public navCtrl: NavController, private storage: Storage, private artistService: ArtistService) { }

  ngOnInit(): void {
    // Initialize email and name from locally-stored values.
    this.artistService.getArtistEmail().then((val) => {
      this.artistEmail = val;
    });

    this.artistService.getArtistName().then((val) => {
      this.artistName = val;
    });

    this.artistForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });

    this.artistForm.valueChanges
      .debounceTime(400)
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    if (!this.artistForm) { return; }
    const form = this.artistForm;
    let atLeastOneFieldTouched: boolean = false;
    let nonBlankFieldCount: number = 0;
    let formIsValid: boolean = true;
    for (const field in this.formErrors) {
      // clear previous error message
      this.formErrors[field] = [];
      this.artistForm[field] = '';
      const control = form.get(field);
      if (control) {
        if (control.value) {
          nonBlankFieldCount++;
        }
        if (control.dirty) {
          atLeastOneFieldTouched = true;
          if (!control.valid) {
            formIsValid = false;
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              this.formErrors[field].push(messages[key]);
            }
          }
        }
      }
    }

    if (nonBlankFieldCount == 0 || nonBlankFieldCount == 2) {
      this.fieldsRequiredMessageHidden = true;
      if (atLeastOneFieldTouched && formIsValid) {
        this.saveArtistEmail();
        this.saveArtistName();
      }
    } else {
      this.fieldsRequiredMessageHidden = false;
    }
  }

  saveArtistEmail(): void {
    this.artistService.setArtistEmail(this.artistEmail);
  }

  saveArtistName(): void {
    this.artistService.setArtistName(this.artistName);
  }
}
