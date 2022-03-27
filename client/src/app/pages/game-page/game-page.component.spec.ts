import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changerPolice devrait appeler changerPolice du service', () => {
        // eslint-disable-next-line dot-notation
        const spyService = spyOn(component['tailleService'], 'changerPolice');
        component.changerPolice('+');
        expect(spyService).toHaveBeenCalled();
    });

    it('le bouton passer tour devrait appeler le gestionnaire de commande', () => {
        // eslint-disable-next-line dot-notation
        const spyService = spyOn(component['commande'], 'envoyerCommande');
        component.passerTour();
        expect(spyService).toHaveBeenCalled();
    });

    it('focusOut', () => {
        // eslint-disable-next-line dot-notation
        const spyService = spyOn(component['placementManuel'], 'reinitialiserPlacement');
        const bouton = document.createElement('button');
        bouton.id = 'bouton-jouer';
        const focusEvent = new FocusEvent('focusout', { relatedTarget: bouton });
        component.focusOut(focusEvent);
        expect(spyService).not.toHaveBeenCalled();
    });

    it('focusOut', () => {
        // eslint-disable-next-line dot-notation
        const spyService = spyOn(component['placementManuel'], 'reinitialiserPlacement');
        const bouton = document.createElement('button');
        bouton.id = '';
        const focusEvent = new FocusEvent('focusout', { relatedTarget: bouton });
        component.focusOut(focusEvent);
        expect(spyService).toHaveBeenCalled();
    });

    it('focusOut', () => {
        // eslint-disable-next-line dot-notation
        const spyService = spyOn(component['placementManuel'], 'reinitialiserPlacement');
        const focusEvent = new FocusEvent('focusout');
        component.focusOut(focusEvent);
        expect(spyService).toHaveBeenCalled();
    });

    it('envoyerPlacement', () => {
        // eslint-disable-next-line dot-notation
        const spyReinit = spyOn(component['placementManuel'], 'reinitialiserPlacement');
        // eslint-disable-next-line dot-notation
        const spyCommande = spyOn(component['placementManuel'], 'envoyerCommande');
        component.envoyerPlacement();
        expect(spyReinit).toHaveBeenCalled();
        expect(spyCommande).toHaveBeenCalled();
    });
});
