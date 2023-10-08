import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateComponent } from './components/add-update/add-update.component';

@NgModule({
  declarations: [HeaderComponent, CustomInputComponent,AddUpdateComponent],
  exports: [HeaderComponent, CustomInputComponent,ReactiveFormsModule,AddUpdateComponent],
  imports: [CommonModule,IonicModule,ReactiveFormsModule,FormsModule],
})
export class SharedModule {}
