/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { HAUTEUR_DEFAUT, LARGEUR_DEFAUT } from '@app/constantes/play-area.constantes';
import { GridService } from '@app/services/grid.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(LARGEUR_DEFAUT, HAUTEUR_DEFAUT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('devrait être créé', () => {
        expect(service).toBeTruthy();
    });

    it(' width devrait retourner la largeur du grid canvas', () => {
        expect(service['width']).toEqual(LARGEUR_DEFAUT);
    });

    it(' height devrait retourner la hauteur du grid canvas', () => {
        expect(service['width']).toEqual(HAUTEUR_DEFAUT);
    });

    it(' ecrireMot devrait appeler fillText sur le canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service['ecrireMot']('test', LARGEUR_DEFAUT / 2, HAUTEUR_DEFAUT / 2);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' ecrireMot ne devrait pas appeler fillText si le mot est vide', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service['ecrireMot']('', LARGEUR_DEFAUT / 2, HAUTEUR_DEFAUT / 2);
        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });

    it(' ecrireMot devrait colorier des pixels sur le canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['ecrireMot']('test', LARGEUR_DEFAUT / 2, HAUTEUR_DEFAUT / 2);
        imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' dessinerTableau devrait appeler moveTo et lineTo', () => {
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        service.dessinerTableau();
        expect(moveToSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
    });

    it(' dessinerTableau devrait colorier des pixels sur le canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.dessinerTableau();
        imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' dessinerTableau devrait appeler dessinerEtoile et dessinerCaseBonus', () => {
        const dessinerEtoileSpy = spyOn(service, <any>['dessinerEtoile']).and.callThrough();
        const dessinerCaseBonusSpy = spyOn(service, <any>['dessinerCaseBonus']).and.callThrough();
        service.dessinerTableau();
        expect(dessinerEtoileSpy).toHaveBeenCalled();
        expect(dessinerCaseBonusSpy).toHaveBeenCalled();
    });

    it(' dessinerEtoile devrait colorier des pixels sur le canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['dessinerEtoile']();
        imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' illuminerCaseSel devrait colorier des pixels sur le canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['caseSelectionnee'] = { x: 1, y: 2 };
        service['illuminerCaseSel']();
        imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' dessinerFleche devrait colorier des pixels sur le canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['caseSelectionnee'] = { x: 1, y: 2 };
        service['dessinerFleche'](true);
        imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' dessinerFleche devrait colorier des pixels sur le canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['caseSelectionnee'] = { x: 1, y: 2 };
        service['dessinerFleche'](false);
        imageData = service.gridContext.getImageData(0, 0, service['width'], service['height']).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' selectionnerCase devrait appeler dessinerTableau, illuminerCaseSel et dessinerFleche', () => {
        const spyFleche = spyOn(service, <any>['dessinerFleche']).and.callThrough();
        const spyIlluminer = spyOn(service, <any>['illuminerCaseSel']).and.callThrough();
        const spyDessiner = spyOn(service, 'dessinerTableau').and.callThrough();
        service.selectionnerCase(1, 3, true);
        expect(spyDessiner).toHaveBeenCalled();
        expect(spyIlluminer).toHaveBeenCalled();
        expect(spyFleche).toHaveBeenCalled();
    });
});
