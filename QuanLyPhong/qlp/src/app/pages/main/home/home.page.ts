import { Component, OnInit, inject } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateComponent } from 'src/app/shared/components/add-update/add-update.component';
import { orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSer = inject(FirebaseService);
  utilsSer = inject(UtilsService);

  items: Item[] = [];
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
        this.items = res;
        this.loading = false;
        sub.unsubscribe();
      },
    });
  }
  signOut() {
    this.firebaseSer.signOut();
  }

  async addUpdate(item?: Item) {
    let success = await this.utilsSer.presentModal({
      component: AddUpdateComponent,
      cssClass: 'add-update-modal',
      componentProps: { item },
    });
    if (success) this.getItems();
  }

  async presentAlertConfirm(item: Item) {
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
            this.deleteItem(item);
          },
        },
      ],
    });
  }

  async deleteItem(item: Item) {
    let path = `rooms/${item.id}`;

    const loading = await this.utilsSer.loading();
    await loading.present();

    let imgpath = await this.firebaseSer.getFilePath(item.image);
    await this.firebaseSer.deleteFile(imgpath);

    this.firebaseSer
      .deleteDocument(path)
      .then(async (res) => {
        this.items = this.items.filter((i) => i.id !== item.id);
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
}
