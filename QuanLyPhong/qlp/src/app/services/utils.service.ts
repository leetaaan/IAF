import { Inject, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  modalController = inject(ModalController);
  alertController= inject(AlertController)

  async takePicture(promptLabelHeader) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto:'Chọn ảnh từ thư viện',
      promptLabelPicture:'Mở máy ảnh'
    });
  }
  async presentAlert(opts?:AlertOptions) {
    const alert = await this.alertController.create(opts);
  
    await alert.present();
  }

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }
  dismissModal(data?: any) {
    return this.modalController.dismiss(data);
  }
}
