import { Component, OnInit, inject } from '@angular/core';

import { Room } from 'src/app/models/room.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateRoomsComponent } from 'src/app/shared/components/add-update-rooms/add-update-rooms.component';
import { orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-manager-rooms',
  templateUrl: './manager-rooms.page.html',
  styleUrls: ['./manager-rooms.page.scss'],
})
export class ManagerRoomsPage implements OnInit {
  firebaseSer = inject(FirebaseService);
  utilsSer = inject(UtilsService);

  rooms: Room[] = [];
  loading: boolean = false;

  ngOnInit() {}
  
  user(): User {
    return this.utilsSer.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getItems();
  }

doRefresh(event) {
  setTimeout(() => {
    this.getItems();
    event.target.complete();
  }, 1000);
}




  getItems() {
    let path = `rooms`;

    this.loading = true;

    let query = [
      orderBy('room', 'asc'), 
   //where('room', '<', 199)
  ];
    let sub = this.firebaseSer.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.rooms = res;
        this.loading = false;
        sub.unsubscribe();
      },
    });
  }
  signOut() {
    this.firebaseSer.signOut();
  }

  async addUpdate(room?: Room) {
    let success = await this.utilsSer.presentModal({
      component: AddUpdateRoomsComponent,
      cssClass: 'add-update-modal',
      componentProps: { room },
    });
    if (success) this.getItems();
  }

  async presentAlertConfirm(room: Room) {
    this.utilsSer.presentAlert({
      header: 'Bạn có muốn xóa không!',
      mode: 'ios',
      buttons: [
        {
          text: 'Không',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Xóa',
          handler: () => {
            this.deleteItem(room);
          },
        },
      ],
    });
  }

  getTotalPrice(){
    return this.rooms.reduce((index,room)=>index+room.price,0)
  }

  async deleteItem(room: Room) {
    let path = `rooms/${room.id}`;

    const loading = await this.utilsSer.loading();
    await loading.present();

    let imgpath = await this.firebaseSer.getFilePath(room.image);
    await this.firebaseSer.deleteFile(imgpath);

    this.firebaseSer
      .deleteDocument(path)
      .then(async (res) => {
        this.rooms = this.rooms.filter((i) => i.id !== room.id);
        this.utilsSer.presentToast({
          message: 'Xóa thành công',
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
  gotoMR(){
    this.utilsSer.routerLink('/main/manager-rooms')
  }
  
}
