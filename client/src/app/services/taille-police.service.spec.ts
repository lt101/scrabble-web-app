/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { TaillePoliceService, TAILLE_INITIALE, TAILLE_MAX, TAILLE_MIN } from './taille-police.service';

describe('TaillePoliceService', () => {
    let service: TaillePoliceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaillePoliceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('devrait augmenter la valeur de taillePolice', () => {
        service['taillePolice'] = TAILLE_INITIALE;
        service.changerPolice('+');
        expect(service['taillePolice']).toEqual(TAILLE_INITIALE + 1);
    });

    it('devrait diminuer la valeur de taillePolice', () => {
        service['taillePolice'] = TAILLE_INITIALE;
        service.changerPolice('-');
        expect(service['taillePolice']).toEqual(TAILLE_INITIALE - 1);
    });

    it('ne devrait pas augmenter la valeur de taillePolice si elle est à TAILLE_MAX', () => {
        service['taillePolice'] = TAILLE_MAX;
        service.changerPolice('+');
        expect(service['taillePolice']).toEqual(TAILLE_MAX);
    });

    it('ne devrait pas diminuer la valeur de taillePolice si elle est à TAILLE_MIN', () => {
        service['taillePolice'] = TAILLE_MIN;
        service.changerPolice('-');
        expect(service['taillePolice']).toEqual(TAILLE_MIN);
    });

    it('devrait acheminer la nouvelle taille à travers son observable', () => {
        service['taillePolice'] = TAILLE_INITIALE;
        let taille = TAILLE_INITIALE;
        taille--;
        service.police.subscribe((taillePolice) => {
            expect(taillePolice).toEqual(taille);
        });
        service.changerPolice('-');
    });
});
