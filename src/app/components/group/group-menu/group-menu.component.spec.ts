import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMenuComponent } from './group-menu.component';

describe('GroupMenuComponent', () => {
  let component: GroupMenuComponent;
  let fixture: ComponentFixture<GroupMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
