import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent implements OnInit {
@Input() item:Item

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl(''),
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
    if(this.item) this.form.setValue(this.item)
  }

  async takeImg() {
    const dataUrl = (await this.utilsSer.takePicture('Chọn phương thức'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }
submit(){
  if(this.form.valid){
    if(this.item) this.updateItem();
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
      let path = `rooms/${this.item.id}`;
      const loading = await this.utilsSer.loading();
      await loading.present();

      if(this.form.value.image !== this.item.image){
        let dataUrl = this.form.value.image;
        let imgpath = await this.firebaseSer.getFilePath(this.item.image);
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
