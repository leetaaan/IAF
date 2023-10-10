import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { GoogleMap,Marker } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  utilsSer = inject(UtilsService);
  
  @ViewChild('map')
  mapRef: ElementRef;
  map: GoogleMap;

  user(): User {
    return this.utilsSer.getFromLocalStorage('user');
  }
  ionViewDidEnter() {
    this.createMap();
  }
  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      element: this.mapRef.nativeElement,
      apiKey: environment.mapskey,
      config: {
        center: {
          lat: 11.9545604,
          lng: 108.4442049,
        },
        zoom: 17,
      },
    });
    await this.addMarkers()
  }
  async addMarkers(){
    const markers: Marker[]=[{
      coordinate:{
        lat: 11.9545604,
          lng: 108.4442049,
      },
      title:'localhost',
      snippet:'bla bla',
    },];
    const result=await this.map.addMarkers(markers);
this.map.setOnMarkerClickListener(async(markers)=>{
  console.log(markers)
})
  }
}
