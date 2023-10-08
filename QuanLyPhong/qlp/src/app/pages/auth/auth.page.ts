import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSer = inject(FirebaseService);
  utilsSer = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSer.loading();
      await loading.present();

      this.firebaseSer
        .signIn(this.form.value as User)
        .then((res) => {
          this.getUserInfo(res.user.uid)
        })
        .catch((error) => {
          console.log(error);
          this.utilsSer.presentToast({
            message:error.message,
            duration:2500,
            color:"primary",
            position:"middle",
            icon:"alert-circle-outline"
          })
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
