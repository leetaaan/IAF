import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateComponent } from './components/add-update/add-update.component';
import { AddUpdateRoomsComponent } from './components/add-update-rooms/add-update-rooms.component';
@NgModule({
  declarations: [HeaderComponent, CustomInputComponent,AddUpdateComponent,AddUpdateRoomsComponent],
  exports: [HeaderComponent, CustomInputComponent,ReactiveFormsModule,AddUpdateComponent,AddUpdateRoomsComponent],
  imports: [CommonModule,IonicModule,ReactiveFormsModule,FormsModule],
})
export class SharedModule {}
