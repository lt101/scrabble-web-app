import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoindrePartieComponent } from './joindre-partie.component';

describe('JoindrePartieComponent', () => {
    let component: JoindrePartieComponent;
    let fixture: ComponentFixture<JoindrePartieComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoindrePartieComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(JoindrePartieComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
