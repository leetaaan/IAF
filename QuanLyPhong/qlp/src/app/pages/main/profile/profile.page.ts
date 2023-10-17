import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSer = inject(FirebaseService);
  utilsSer = inject(UtilsService);

  ngOnInit() {
  }

  user(): User {
    return this.utilsSer.getFromLocalStorage('user');
  }
  signOut(){
    this.firebaseSer.signOut()
  }
  async takeImg() {
    let user =this.user();
    let path = `users/${user.uid}`;

    const dataUrl = (await this.utilsSer.takePicture('Chọn phương thức')).dataUrl;

    const loading = await this.utilsSer.loading();
    await loading.present();

    let imgpath = `${user.uid}/profile`;
    user.image = await this.firebaseSer.uploadImage(imgpath, dataUrl);


    this.firebaseSer
      .updateDocument(path, {image:user.image})
      .then(async (res) => {

        this.utilsSer.saveInLocalStorage('user',user);

        this.utilsSer.presentToast({
          message: 'Thêm ảnh thành công',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilsSer.presentToast({
          message: error.message,
          duration: 2500,
          color: 'red',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
        loading.dismiss();
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
