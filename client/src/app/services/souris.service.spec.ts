/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { Coordonnee } from '@app/interfaces/coordonnee';
import { SourisService } from './souris.service';

describe('SourisService', () => {
    let service: SourisService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SourisService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' detecterCliqueSouris devrait actualiser mousePosition', () => {
        const mockClick = new MouseEvent('mousedown', { clientX: 15, clientY: 15 });
        const reponseAttendue: Coordonnee = { x: 15, y: 15 };
        service.detecterCliqueSouris(mockClick);
        expect(service['positionSouris']).toEqual(reponseAttendue);
    });

    it(' detecterBoutton devrait actualiser bouttonPresser', () => {
        const mockBouttonPresser = new KeyboardEvent('keypress', {
            key: 'Backspace',
        });
        service.detecterBoutton(mockBouttonPresser);
        expect(service.bouttonPresser).toEqual('Backspace');
    });
});
