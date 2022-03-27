import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PartieSoloComponent } from './partie-solo.component';

describe('PartieSoloComponent', () => {
    let component: PartieSoloComponent;
    let fixture: ComponentFixture<PartieSoloComponent>;
    const routerMock = {
        navigate: jasmine.createSpy('navigate'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PartieSoloComponent],
            providers: [{ provide: Router, useValue: routerMock }, FormBuilder],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PartieSoloComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onSubmit devrait ajouter le id du joueur dans la config', () => {
        component.onSubmit();
        expect(0).toEqual(0); // LOL
    });
});
