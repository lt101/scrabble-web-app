/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChevaletService } from '@app/services/chevalet.service';
import { BoutonEchangeComponent } from './bouton-echange.component';

describe('BoutonEchangeComponent', () => {
    let component: BoutonEchangeComponent;
    let fixture: ComponentFixture<BoutonEchangeComponent>;
    let serviceChevalet: ChevaletService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BoutonEchangeComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        serviceChevalet = TestBed.inject(ChevaletService);
        fixture = TestBed.createComponent(BoutonEchangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('echanger devrait appeler echangerLettres de chevaletService', () => {
        const spyEchange = spyOn(serviceChevalet, 'echangerLettres');
        component.echanger();
        expect(spyEchange).toHaveBeenCalled();
    });

    it('annulerEchange devrait annuler la selection de chevaletService', () => {
        component.annulerEchange();
        expect(serviceChevalet.selectEchange).toEqual([]);
    });

    it('boutonActif devrait retourner true si conditions respectees', () => {
        serviceChevalet.selectEchange.length = 7;
        component.estTourJoueur = true;
        component['qteLettre'] = 20;
        expect(component.boutonActif()).toEqual(true);
    });

    it('boutonActif devrait retourner true si ce pas tour du joueur', () => {
        serviceChevalet.selectEchange.length = 7;
        component.estTourJoueur = false;
        component['qteLettre'] = 20;
        expect(component.boutonActif()).toEqual(false);
    });

    it('boutonActif devrait retourner true si aucune lettre selectionnee', () => {
        serviceChevalet.selectEchange.length = 0;
        component.estTourJoueur = true;
        component['qteLettre'] = 20;
        expect(component.boutonActif()).toEqual(false);
    });

    it('boutonActif devrait retourner true si pas assez de lettre dans reserve', () => {
        serviceChevalet.selectEchange.length = 1;
        component.estTourJoueur = true;
        component['qteLettre'] = 6;
        expect(component.boutonActif()).toEqual(false);
    });
});
