/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Joueur } from '@app/classes/joueur';
import { MinuteriePipe } from '@app/pipes/minuterie.pipe';
import { GestionnaireDeSocketService } from '@app/services/gestionnaire-de-socket.service';
import { PanneauInformatifComponent } from './panneau-informatif.component';

describe('PanneauInformatifComponent', () => {
    let component: PanneauInformatifComponent;
    let fixture: ComponentFixture<PanneauInformatifComponent>;
    let socketManager: GestionnaireDeSocketService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PanneauInformatifComponent, MinuteriePipe],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PanneauInformatifComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('updatePanneau devrait mettre a jour les infos du panneau', () => {
        socketManager = TestBed.inject(GestionnaireDeSocketService);
        socketManager.socket.id = '1234';
        const joueurTest = new Joueur('1', '1234');
        const partieTest = {
            joueurs: [joueurTest, new Joueur('joueurVirtuelTest', '')],
            idPartie: '',
            joueurActif: joueurTest,
            reserve: ['a', 'b', 'c'],
        };
        component['updatePanneau'](partieTest);
        expect(component.joueurActif).toBe(partieTest.joueurActif.nom);
        expect(component.reserve).toBe(partieTest.reserve.length);
    });

    it('updatePanneau ne devrait pas mettre a jour les infos du panneau si la partie est finie', () => {
        socketManager = TestBed.inject(GestionnaireDeSocketService);
        socketManager.socket.id = '1234';
        const joueurTest = new Joueur('1', '1234');
        const partieTest = {
            joueurs: [joueurTest, new Joueur('joueurVirtuelTest', '')],
            idPartie: '',
            joueurActif: joueurTest,
            reserve: ['a', 'b', 'c'],
        };
        component['updatePanneau'](partieTest);
        expect(component.joueurActif).toBe(partieTest.joueurActif.nom);
        expect(component.reserve).toBe(partieTest.reserve.length);

        component['partieEstFinie'] = true;
        const joueurTest2 = new Joueur('3', '0000');
        const partieTest2 = {
            joueurs: [joueurTest2, new Joueur('joueurVirtuelTest', '')],
            idPartie: '',
            joueurActif: joueurTest2,
            reserve: ['a', 'b', 'c'],
        };
        component['updatePanneau'](partieTest2);
        expect(component.joueurActif).toBe(partieTest.joueurActif.nom);
        expect(component.reserve).toBe(partieTest.reserve.length);
    });

    it('annoncerGagnant devrait annoncer le gagnant', () => {
        component['annoncerGagnant']({ message: '', nomGagnant: '1' });
        expect(document.getElementsByClassName('tour')[0].innerHTML).toBe('1 a gagné! Félicitations!');
    });

    it("annoncerGagnant devrait gérer l'égalité", () => {
        component.adversaire = new Joueur('abc', '1234');
        component.utilisateur = new Joueur('def', '5678');
        component['annoncerGagnant']({ message: '', nomGagnant: '' });
        expect(document.getElementsByClassName('tour')[0].innerHTML).toBe('def et abc ont égalité! Félicitations!');
    });
});
