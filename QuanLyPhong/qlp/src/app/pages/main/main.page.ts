import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  pages = [
    { title: 'Trang chủ', url: '/main/home', icon: 'home-outline' },
    { title: 'Map', url: '/main/profile', icon: 'person-outline' },

  ];
  router = inject(Router);
  firebaseSer = inject(FirebaseService);
  utilsSer = inject(UtilsService);
  
  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });
  }

  user(): User {
    return this.utilsSer.getFromLocalStorage('user');
  }
  
  signOut(){
    this.firebaseSer.signOut()
  }
}
