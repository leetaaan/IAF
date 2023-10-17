import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactUsPageRoutingModule } from './contact-us-routing.module';

import { ContactUsPage } from './contact-us.page';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactUsPageRoutingModule,
    SharedModule
  ],
  declarations: [ContactUsPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactUsPageModule {}
