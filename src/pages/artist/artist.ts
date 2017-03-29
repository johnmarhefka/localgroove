
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
    'name': {}
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
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
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
    let formIsValid: boolean = true;
    for (const field in this.formErrors) {
      // clear previous error message
      this.formErrors[field] = [];
      this.artistForm[field] = '';
      const control = form.get(field);
      if (control && control.dirty) {
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

    if (atLeastOneFieldTouched && !form.invalid) {
      this.saveArtistEmail();
      this.saveArtistName();
    }
  }

  saveArtistEmail(): void {
    this.artistService.setArtistEmail(this.artistEmail);
  }

  saveArtistName(): void {
    this.artistService.setArtistName(this.artistName);
  }
}
