/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { TestBed } from '@angular/core/testing';
import { Clavardage } from '@app/interfaces/clavardage';
import { ClavardageService } from './clavardage.service';

describe('ClavardageService', () => {
    let service: ClavardageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClavardageService);
    });

    it('devrait être créé', () => {
        expect(service).toBeTruthy();
    });

    it('envoyerMessage devrait etre appeler', () => {
        const spy = spyOn(service, 'envoyerMessage').and.callThrough();
        const commande: Clavardage = { auteur: 'Tester', message: 'commande' };
        service.envoyerMessage(commande);
        expect(spy).toHaveBeenCalled();
    });

    it('envoyerMessage devrait appeler envoyerCommande si le message commence avec !', () => {
        const spy = spyOn(service, <any>['envoyerCommande']).and.callThrough();
        const commande: Clavardage = { auteur: 'Tester', message: '!commande' };
        service.envoyerMessage(commande);
        expect(spy).toHaveBeenCalled();
    });
});
