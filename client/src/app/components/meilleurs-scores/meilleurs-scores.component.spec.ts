import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeilleursScoresComponent } from './meilleurs-scores.component';

describe('MeilleursScoresComponent', () => {
    let component: MeilleursScoresComponent;
    let fixture: ComponentFixture<MeilleursScoresComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MeilleursScoresComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MeilleursScoresComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
