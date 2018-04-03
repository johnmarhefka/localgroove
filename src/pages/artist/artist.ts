
import { Component } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms'

import { ViewController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { ArtistService } from '../../services/artist.service';
import { AnalyticsService } from '../../services/analytics.service';

const EMAIL_REGEX = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';

@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html'
})
export class ArtistPage {

  artistForm: FormGroup;
  artistEmail: string;
  artistEmailConfirm: string;
  artistName: string;
  fieldsRequiredMessageHidden: boolean = true;

  formErrors = {
    'name': [],
    'email': [],
    'emailConfirm': []
  };

  validationMessages = {
    'email': {
      'pattern': 'Invalid email address.'
    },
    'emailConfirm': {
      'pattern': 'Invalid email address.',
      'validateEmailMatch': "Email doesn't match."
    },
    'name': {}
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private storage: Storage, private artistService: ArtistService, private analyticsService: AnalyticsService, private toastCtrl: ToastController) { }

  ngOnInit(): void {
    // Initialize email and name from locally-stored values.
    this.artistService.getArtistEmail().then((val) => {
      this.artistEmail = val;
      this.artistEmailConfirm = val;
    });

    this.artistService.getArtistName().then((val) => {
      this.artistName = val;
    });

    this.artistForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(EMAIL_REGEX)
      ])),
      emailConfirm: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(EMAIL_REGEX)
      ]))
    });

    this.artistForm.valueChanges
      .debounceTime(1000)
      .subscribe(data => this.saveChanges(data));
  }

  ionViewWillEnter() {
    // We don't ever need the back button on this page.
    this.viewCtrl.showBackButton(false);
    this.logPageView();
  }

  // Validates that the "confirm email" value matches the original email value. The parameter is the "confirm email" control.
  validateEmailMatch(form: FormGroup): boolean {
    // This function gets hit when the page loads and nothing is initialized, so this big "if" bypasses that case.
    if (form && form.controls
      && form.controls['email'] && form.controls['email'].value
      && form.controls['emailConfirm'] && form.controls['emailConfirm'].value) {

      let emailControl = form.controls['email'];
      let emailMatchControl = form.controls['emailConfirm'];

      let originalEmail = emailControl.value.trim().toLowerCase();
      let emailMatch = emailMatchControl.value.trim().toLowerCase();

      // Clear error messages from previous validation runs
      emailMatchControl.setErrors(null);
      this.formErrors['emailConfirm'] = [];

      if (originalEmail == emailMatch) {
        return true;
      } else {
        // Add error to array of errors for this control
        emailMatchControl.setErrors({ validateEmailMatch: 'validateEmailMatch' });
        const messages = this.validationMessages['emailConfirm'];
        for (const key in emailMatchControl.errors) {
          this.formErrors['emailConfirm'].push(messages[key]);
        }
        return false
      }
    } else {
      return true;
    }
  }

  saveChanges(data?: any) {
    if (!this.artistForm) { return; }
    const form = this.artistForm;

    // Explicitly handling the "matching emails" validation here.
    let emailsMatch: boolean = this.validateEmailMatch(form);

    let atLeastOneFieldTouched: boolean = false;
    for (const field in this.formErrors) {
      // clear previous error message
      this.formErrors[field] = [];
      this.artistForm[field] = '';
      const control = form.get(field);
      if (control && control.dirty) {
        atLeastOneFieldTouched = true;
        if (!control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field].push(messages[key]);
          }
        }
      }
    }

    if (atLeastOneFieldTouched && !form.invalid && emailsMatch) {
      this.saveArtistEmail();
      this.saveArtistName();
      this.presentToast();
      this.analyticsService.logEvent("artist_registered", { artistEmail: this.artistEmail.trim().toLowerCase(), artistName: this.artistName.trim() });
      // Have them start getting artist-pertinent notifications.
      this.artistService.subscribeToArtistNotifications();
    }
  }

  saveArtistEmail(): void {
    this.artistService.setArtistEmail(this.artistEmail.trim().toLowerCase());
  }

  saveArtistName(): void {
    this.artistService.setArtistName(this.artistName.trim());
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Artist details saved. Select "Venues" to check in!',
      duration: 3000,
      cssClass: "toast-success",
      position: 'top'
    });

    toast.present();
  }

  logPageView() {
    this.analyticsService.setCurrentScreen('artist');
    this.analyticsService.logPageView({ page: "artist" });
  }
}
