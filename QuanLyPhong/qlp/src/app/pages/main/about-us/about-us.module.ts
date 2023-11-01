import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutUsPageRoutingModule } from './about-us-routing.module';

import { AboutUsPage } from './about-us.page';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    declarations: [AboutUsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AboutUsPageRoutingModule,
        SharedModule
    ]
})
export class AboutUsPageModule {}
