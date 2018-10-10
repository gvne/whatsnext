import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeVideoDetailComponent } from './youtube-video-detail.component';

describe('YoutubeVideoDetailComponent', () => {
  let component: YoutubeVideoDetailComponent;
  let fixture: ComponentFixture<YoutubeVideoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeVideoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeVideoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
