import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  firebaseSer = inject(FirebaseService);
  utilsSer = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSer.loading();
      await loading.present();

      this.firebaseSer
        .signUp(this.form.value as User)
        .then(async (res) => {
          await this.firebaseSer.updateUser(this.form.value.name);

          let uid = res.user.uid;
          this.form.controls.uid.setValue(uid);
          
          this.setUserInfo(uid);
        })
        .catch((error) => {
          console.log(error);
          this.utilsSer.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSer.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;

      this.firebaseSer
        .setDocument(path, this.form.value)
        .then(async (res) => {
          this.utilsSer.saveInLocalStorage('user', this.form.value);
          this.utilsSer.routerLink('/main/home');
          this.form.reset();
        })
        .catch((error) => {
          console.log(error);
          this.utilsSer.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }


  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSer.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSer
        .getDocument(path)
        .then((user:User)=> {
          this.utilsSer.saveInLocalStorage('user',user);
          this.utilsSer.routerLink('/main/home');
          this.form.reset();

          this.utilsSer.presentToast({
            message: 'Chào mừng',
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline',
          });
        })
        .catch((error) => {
          console.log(error);
          this.utilsSer.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
