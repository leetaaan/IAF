import { Component, OnInit, inject } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateComponent } from 'src/app/shared/components/add-update/add-update.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSer = inject(FirebaseService);
  utilsSer = inject(UtilsService);

  items: Item[] = [];

  ngOnInit() {}
  user(): User {
    return this.utilsSer.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getItems();
  }

  getItems() {
    let path = `rooms`;

    let sub = this.firebaseSer.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.items = res;
        sub.unsubscribe();
      },
    });
  }
  signOut() {
    this.firebaseSer.signOut();
  }

  addUpdate( item?: Item) {
    this.utilsSer.presentModal({
      component: AddUpdateComponent,
      cssClass: 'add-update-modal',
      componentProps:{item}
    });
  }
}
