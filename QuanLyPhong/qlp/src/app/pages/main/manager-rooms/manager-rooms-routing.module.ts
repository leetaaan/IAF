import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerRoomsPage } from './manager-rooms.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerRoomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoomsPageRoutingModule {}
