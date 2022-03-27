/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PAS_SELECT } from '@app/constantes/chevalet.service.constantes';
import { ChevaletService } from '@app/services/chevalet.service';
import { SourisService } from '@app/services/souris.service';
import { ChevaletComponent } from './chevalet.component';

describe('ChavaletComponent', () => {
    let component: ChevaletComponent;
    let sourisService: SourisService;
    let fixture: ComponentFixture<ChevaletComponent>;
    let chevaletService: ChevaletService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChevaletComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChevaletComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        sourisService = TestBed.inject(SourisService);
        chevaletService = TestBed.inject(ChevaletService);
    });

    it('devrait etre cree', () => {
        expect(component).toBeTruthy();
    });

    it('reconnaitreTouche devrait reconnaitre la touche du clavier', () => {
        const spyDetecter = spyOn(sourisService, 'detecterBoutton');
        const keyEventData = { isTrusted: true, code: 'KeyB' };
        const appuiB = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiB);
        expect(spyDetecter).toHaveBeenCalledWith(appuiB);
    });

    it('reconnaitreTouche devrait reconnaitre la flèche droite du clavier', () => {
        const spyDeplacer = spyOn(chevaletService, 'deplacerLettre');
        const keyEventData = { isTrusted: true, key: 'ArrowRight' };
        const appuiDroit = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiDroit);
        expect(spyDeplacer).toHaveBeenCalledWith(false);
    });

    it('reconnaitreTouche devrait reconnaitre la flèche gauche du clavier', () => {
        const spyDeplacer = spyOn(chevaletService, 'deplacerLettre');
        const keyEventData = { isTrusted: true, key: 'ArrowLeft' };
        const appuiLeft = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiLeft);
        expect(spyDeplacer).toHaveBeenCalledWith(true);
    });

    it('wheelScrollLettre devrait reconnaitre un scroll de la souris', () => {
        const spyDeplacer = spyOn(chevaletService, 'deplacerLettre');
        const wheelEventData = { deltaY: 100 };
        const scrollTest = new WheelEvent('wheel', wheelEventData);
        component.wheelScrollLettre(scrollTest);
        expect(spyDeplacer).toHaveBeenCalledWith(false);
    });

    it('wheelScrollLettre devrait reconnaitre un scroll de la souris', () => {
        const spyDeplacer = spyOn(chevaletService, 'deplacerLettre');
        const wheelEventData = { deltaY: 0 };
        const scrollTest = new WheelEvent('wheel', wheelEventData);
        component.wheelScrollLettre(scrollTest);
        expect(spyDeplacer).not.toHaveBeenCalled();
    });

    it('wheelScrollLettre devrait reconnaitre un scroll de la souris', () => {
        const spyDeplacer = spyOn(chevaletService, 'deplacerLettre');
        const wheelEventData = { deltaY: -100 };
        const scrollTest = new WheelEvent('wheel', wheelEventData);
        component.wheelScrollLettre(scrollTest);
        expect(spyDeplacer).toHaveBeenCalledWith(true);
    });

    it('estSelectionEchange dervrait appeler estSelectionEchange du service', () => {
        const spyEstSelect = spyOn(chevaletService, 'estSelectionEchange');
        component.estSelectionEchange(0);
        expect(spyEstSelect).toHaveBeenCalled();
    });

    it('estSelectManip dervrait comparer avec selectManip du service', () => {
        chevaletService.selectManip = 0;
        expect(component.estSelectManip(0)).toBeTrue();
        expect(component.estSelectManip(1)).toBeFalse();
    });

    it('selectionnerEchange devrait appeler selectionnerEchange du service', () => {
        const spySelectEchange = spyOn(chevaletService, 'selectionnerEchange');
        component.selectionnerEchange(new Event(''), 0);
        expect(spySelectEchange).toHaveBeenCalled();
    });

    it('selectionnerManip devrait appeler selectionnerManip du service', () => {
        const spySelectManip = spyOn(chevaletService, 'selectionnerManip');
        component.selectionnerManip(0);
        expect(spySelectManip).toHaveBeenCalled();
    });

    it('annulerEchange devrait annuler la selection', () => {
        chevaletService.selectEchange = [0, 1, 2];
        chevaletService.selectManip = 7;
        component['annulerEchange']();
        expect(chevaletService.selectEchange).toEqual([]);
        expect(chevaletService.selectManip).toEqual(PAS_SELECT);
    });
});
