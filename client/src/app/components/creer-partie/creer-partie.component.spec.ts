import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CreerPartieComponent } from './creer-partie.component';

describe('CreerPartieComponent', () => {
    let component: CreerPartieComponent;
    let fixture: ComponentFixture<CreerPartieComponent>;
    const routerMock = {
        navigate: jasmine.createSpy('navigate'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreerPartieComponent],
            providers: [{ provide: Router, useValue: routerMock }, FormBuilder],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreerPartieComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
