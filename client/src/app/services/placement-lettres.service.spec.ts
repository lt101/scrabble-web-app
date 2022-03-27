/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { ElementRef, QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Lettre } from '@app/classes/lettre';
import { PlacementLettresService } from './placement-lettres.service';

describe('PlacementLettresService', () => {
    let service: PlacementLettresService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // providers: [
            //     {
            //         provide: TaillePoliceService,
            //         useClass: TaillePoliceService,
            //     },
            // ],
        });
        service = TestBed.inject(PlacementLettresService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Manipulation du HTMLElement', () => {
        let htmlElement: HTMLElement;

        beforeEach(() => {
            htmlElement = global.document.createElement('div');
            htmlElement.style.zIndex = '1';
            htmlElement.style.visibility = 'hidden';
            const valeur = global.document.createElement('div');
            const pointage = global.document.createElement('div');
            valeur.className = 'valeur';
            pointage.className = 'pointage';
            htmlElement.appendChild(valeur);
            htmlElement.appendChild(pointage);
        });

        it('afficherTuile devrait modifier les propriété du HTMLElement', () => {
            expect(service['afficherTuile'](htmlElement, new Lettre('a'), true)).toBeTrue();
            expect(htmlElement.style.visibility).toBe('visible');
            expect(htmlElement.style.zIndex).toBe('6');
        });

        it('cacherTuile devrait modifier les propriétés du HTMLElement', () => {
            service['afficherTuile'](htmlElement, new Lettre('A'), false);
            expect(service['cacherTuile'](htmlElement)).toBeTrue();
            expect(htmlElement.style.visibility).toBe('hidden');
            expect(htmlElement.style.zIndex).toBe('1');
        });

        it('afficherTuile ne devrait pas modifier les propriété du HTMLElement si il est null', () => {
            expect(service['afficherTuile'](null, new Lettre('a'), false)).toBeFalse();
        });

        it('cacherTuile ne devrait pas modifier les propriété du HTMLElement si il est null', () => {
            expect(service['cacherTuile'](null)).toBeFalse();
        });
    });

    describe('actualiserVue', () => {
        it('actualiserVue devrait appeler afficherTuile et cacherTuile', () => {
            service['tuilesHTML'] = new QueryList<ElementRef>();
            service['tableau'].lettresPlacees[7][7] = new Lettre('a');
            const spyAfficher = spyOn(service, <any>['afficherTuile']);
            const spyCacher = spyOn(service, <any>['cacherTuile']);
            service.actualiserVue();
            expect(spyAfficher).toHaveBeenCalled();
            expect(spyCacher).toHaveBeenCalled();
        });

        it('aContourColore devrait retourner true si la coor est dans placementTemp, false sinon', () => {
            service['placementTemp'] = [
                { lettre: 'a', coor: { x: 2, y: 8 } },
                { lettre: 'b', coor: { x: 3, y: 8 } },
            ];
            expect(service['aContourColore']({ x: 2, y: 8 })).toBeTrue();
            expect(service['aContourColore']({ x: 3, y: 8 })).toBeTrue();
            expect(service['aContourColore']({ x: 2, y: 7 })).toBeFalse();
        });
    });

    describe('Manipulation du tableau', () => {
        it('placerLettre appelle actualiserVue et placerLettres de tableau', () => {
            const spyActualiser = spyOn(service, 'actualiserVue').and.callFake(() => {
                return;
            });
            const spyPlacer = spyOn(service['tableau'], 'placerLettres');
            service.placerLettre([new Lettre('s')], [{ x: 8, y: 8 }]);
            expect(spyPlacer).toHaveBeenCalled();
            expect(spyActualiser).toHaveBeenCalled();
        });

        it('retirerLettre appelle actualiserVue et retirerLettres de tableau', () => {
            const spyActualiser = spyOn(service, 'actualiserVue').and.callFake(() => {
                return;
            });
            service.placerLettre([new Lettre('s')], [{ x: 8, y: 8 }]);
            const spyRetirer = spyOn(service['tableau'], 'retirerLettres');
            service.retirerLettre([{ x: 8, y: 8 }]);
            expect(spyRetirer).toHaveBeenCalled();
            expect(spyActualiser).toHaveBeenCalledTimes(2);
        });
    });
});
