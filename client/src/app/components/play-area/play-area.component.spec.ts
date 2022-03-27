import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { HAUTEUR_DEFAUT, LARGEUR_DEFAUT } from '@app/constantes/play-area.constantes';
import { PlacementManuelService } from '@app/services/placement-manuel.service';
import { SourisService } from '@app/services/souris.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let placementManuel: PlacementManuelService;
    let serviceSouris: SourisService;
    let mouseEvent: MouseEvent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        serviceSouris = TestBed.inject(SourisService);
        placementManuel = TestBed.inject(PlacementManuelService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' width devrait retourner la largeur du canvas', () => {
        expect(component.width).toEqual(LARGEUR_DEFAUT);
    });

    it(' height devrait retourner la hauteur du canvas', () => {
        expect(component.width).toEqual(HAUTEUR_DEFAUT);
    });

    it(' cliqueSouris devrait appeler detecterCliqueSouris du serviceSouris', () => {
        const spy = spyOn(serviceSouris, 'detecterCliqueSouris');
        const spyPlacement = spyOn(placementManuel, 'selectionnerCase').and.callFake(() => {
            return;
        });
        mouseEvent = { offsetX: 10, offsetY: 10, button: 2 } as MouseEvent;
        component.cliqueSouris(mouseEvent);
        expect(spy).toHaveBeenCalled();
        expect(spyPlacement).toHaveBeenCalled();
    });

    it(' cliqueSouris devrait appeler selectionnerCase du gridService', () => {
        const spy = spyOn(placementManuel, 'selectionnerCase').and.callFake(() => {
            return;
        });
        mouseEvent = { offsetX: 10, offsetY: 10, button: 2 } as MouseEvent;
        component.cliqueSouris(mouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('reconnaitreTouche devrait reconnaitre Backspace', () => {
        const spyRetirer = spyOn(placementManuel, 'retirerLettre').and.callFake(() => {
            return;
        });
        const spyEnvoyer = spyOn(placementManuel, 'envoyerCommande').and.callFake(() => {
            return;
        });
        const spyReinitialiser = spyOn(placementManuel, 'reinitialiserPlacement').and.callFake(() => {
            return;
        });
        const spyPlacer = spyOn(placementManuel, 'placerLettre').and.callFake(() => {
            return;
        });
        const keyEventData = { isTrusted: true, key: 'Backspace' };
        const appuiBackspace = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiBackspace);
        expect(spyRetirer).toHaveBeenCalled();
        expect(spyEnvoyer).not.toHaveBeenCalled();
        expect(spyReinitialiser).not.toHaveBeenCalled();
        expect(spyPlacer).not.toHaveBeenCalled();
    });

    it('reconnaitreTouche devrait reconnaitre Enter', () => {
        const spyRetirer = spyOn(placementManuel, 'retirerLettre').and.callFake(() => {
            return;
        });
        const spyEnvoyer = spyOn(placementManuel, 'envoyerCommande').and.callFake(() => {
            return;
        });
        const spyReinitialiser = spyOn(placementManuel, 'reinitialiserPlacement').and.callFake(() => {
            return;
        });
        const spyPlacer = spyOn(placementManuel, 'placerLettre').and.callFake(() => {
            return;
        });
        const keyEventData = { isTrusted: true, key: 'Enter' };
        const appuiEnter = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiEnter);
        expect(spyRetirer).not.toHaveBeenCalled();
        expect(spyEnvoyer).toHaveBeenCalled();
        expect(spyReinitialiser).not.toHaveBeenCalled();
        expect(spyPlacer).not.toHaveBeenCalled();
    });

    it('reconnaitreTouche devrait reconnaitre Escape', () => {
        const spyRetirer = spyOn(placementManuel, 'retirerLettre').and.callFake(() => {
            return;
        });
        const spyEnvoyer = spyOn(placementManuel, 'envoyerCommande').and.callFake(() => {
            return;
        });
        const spyReinitialiser = spyOn(placementManuel, 'reinitialiserPlacement').and.callFake(() => {
            return;
        });
        const spyPlacer = spyOn(placementManuel, 'placerLettre').and.callFake(() => {
            return;
        });
        const keyEventData = { isTrusted: true, key: 'Escape' };
        const appuiEscape = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiEscape);
        expect(spyRetirer).not.toHaveBeenCalled();
        expect(spyEnvoyer).not.toHaveBeenCalled();
        expect(spyReinitialiser).toHaveBeenCalled();
        expect(spyPlacer).not.toHaveBeenCalled();
    });

    it('reconnaitreTouche devrait reconnaitre Shift et CapsLock', () => {
        const spyRetirer = spyOn(placementManuel, 'retirerLettre').and.callFake(() => {
            return;
        });
        const spyEnvoyer = spyOn(placementManuel, 'envoyerCommande').and.callFake(() => {
            return;
        });
        const spyReinitialiser = spyOn(placementManuel, 'reinitialiserPlacement').and.callFake(() => {
            return;
        });
        const spyPlacer = spyOn(placementManuel, 'placerLettre').and.callFake(() => {
            return;
        });
        const keyEventData = { isTrusted: true, key: 'Shift' };
        const appuiShift = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiShift);
        keyEventData.key = 'CapsLock';
        const appuiCapsLock = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiCapsLock);
        expect(spyRetirer).not.toHaveBeenCalled();
        expect(spyEnvoyer).not.toHaveBeenCalled();
        expect(spyReinitialiser).not.toHaveBeenCalled();
        expect(spyPlacer).not.toHaveBeenCalled();
    });

    it('reconnaitreTouche devrait reconnaitre des lettres', () => {
        const spyRetirer = spyOn(placementManuel, 'retirerLettre').and.callFake(() => {
            return;
        });
        const spyEnvoyer = spyOn(placementManuel, 'envoyerCommande').and.callFake(() => {
            return;
        });
        const spyReinitialiser = spyOn(placementManuel, 'reinitialiserPlacement').and.callFake(() => {
            return;
        });
        const spyPlacer = spyOn(placementManuel, 'placerLettre').and.callFake(() => {
            return;
        });
        const keyEventData = { isTrusted: true, key: 'a' };
        const appuiShift = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiShift);
        keyEventData.key = 'b';
        const appuiCapsLock = new KeyboardEvent('keydown', keyEventData);
        component.reconnaitreTouche(appuiCapsLock);
        expect(spyRetirer).not.toHaveBeenCalled();
        expect(spyEnvoyer).not.toHaveBeenCalled();
        expect(spyReinitialiser).not.toHaveBeenCalled();
        expect(spyPlacer).toHaveBeenCalledTimes(2);
    });
});
