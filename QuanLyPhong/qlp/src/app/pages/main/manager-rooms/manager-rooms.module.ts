import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagerRoomsPageRoutingModule } from './manager-rooms-routing.module';

import { ManagerRoomsPage } from './manager-rooms.page';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    declarations: [ManagerRoomsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ManagerRoomsPageRoutingModule,
        SharedModule
    ]
})
export class ManagerRoomsPageModule {}
