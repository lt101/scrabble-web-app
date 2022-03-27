import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModeLOG2990Component } from './mode-log2990.component';

describe('ModeLOG2990Component', () => {
    let component: ModeLOG2990Component;
    let fixture: ComponentFixture<ModeLOG2990Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModeLOG2990Component],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModeLOG2990Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
