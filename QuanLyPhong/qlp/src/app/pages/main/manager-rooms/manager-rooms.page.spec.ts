import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerRoomsPage } from './manager-rooms.page';

describe('ManagerRoomsPage', () => {
  let component: ManagerRoomsPage;
  let fixture: ComponentFixture<ManagerRoomsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManagerRoomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
