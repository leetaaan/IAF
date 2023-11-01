import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/models/room.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-rooms',
  templateUrl: './add-update-rooms.component.html',
  styleUrls: ['./add-update-rooms.component.scss'],
})
export class AddUpdateRoomsComponent  implements OnInit {
  @Input() room:Room

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('',[Validators.required]),
    room: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    time: new FormControl('', [Validators.required]),
  });

  firebaseSer = inject(FirebaseService);
  utilsSer = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSer.getFromLocalStorage('user');
    if(this.room) this.form.setValue(this.room)
  }

  async takeImg() {
    const dataUrl = (await this.utilsSer.takePicture('Chọn phương thức'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }
submit(){
  if(this.form.valid){
    if(this.room) this.updateItem();
    else this.createItem()
  }
}
  async createItem() {
      let path = `rooms`;
      const loading = await this.utilsSer.loading();
      await loading.present();

      let dataUrl = this.form.value.image;
      let imgpath = `rooms/${Date.now()}`;
      let imgUrl = await this.firebaseSer.uploadImage(imgpath, dataUrl);
      this.form.controls.image.setValue(imgUrl);

      delete this.form.value.id;
      this.firebaseSer
        .addDocument(path, this.form.value)
        .then(async (res) => {
          this.utilsSer.dismissModal({ success: true });

          this.utilsSer.presentToast({
            message: 'them thanh cong',
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
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });

  }
  async updateItem() {
      let path = `rooms/${this.room.id}`;
      const loading = await this.utilsSer.loading();
      await loading.present();

      if(this.form.value.image !== this.room.image){
        let dataUrl = this.form.value.image;
        let imgpath = await this.firebaseSer.getFilePath(this.room.image);
        let imgUrl = await this.firebaseSer.uploadImage(imgpath, dataUrl);
        this.form.controls.image.setValue(imgUrl);
      }


      delete this.form.value.id;

      this.firebaseSer
        .updateDocument(path, this.form.value)
        .then(async (res) => {
          this.utilsSer.dismissModal({ success: true });

          this.utilsSer.presentToast({
            message: 'them thanh cong',
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
