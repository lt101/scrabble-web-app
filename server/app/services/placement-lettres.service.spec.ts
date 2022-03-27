/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Joueur } from '@app/classes/joueur';
import { Lettre } from '@app/classes/lettre';
import { MOT_INVALIDE } from '@app/constantes/placement-lettres.constantes';
import { ERREUR_CASE_NON_VIDE, ERREUR_HORS_CENTRE, ERREUR_HORS_PLATEAU, ERREUR_NON_ADJACENT } from '@app/constantes/placement-lettres.erreurs';
import { expect } from 'chai';
import { PlacementLettresService } from './placement-lettres.service';

describe('Placement Lettre Service', () => {
    const plateauJeu = new PlacementLettresService(new Joueur('joueurTest', ''));

    const reinitialiserPlateau = (): void => {
        plateauJeu.estPremierPlacement = true;
        plateauJeu.plateau = plateauJeu['creerTableauVide']();
        plateauJeu['lettresAjouteeCeTour'] = [];
        plateauJeu['motCrees'] = [];
    };

    it('verification du constructeur plateau', (done: Mocha.Done) => {
        const plateau = plateauJeu.plateau;
        const caseVide = plateau[1][0];
        expect(caseVide.bonusLettre).to.be.a('number').to.equals(1);
        expect(caseVide.bonusMot).to.be.a('number').to.equals(1);
        expect(caseVide.estRemplieCeTour).to.be.a('boolean').to.equals(false);
        expect(caseVide.lettreContenue.lettre).to.be.a('string').to.equals('');

        const caseBonusMot = plateau[3][3];
        expect(caseBonusMot.bonusLettre).to.be.a('number').to.equals(1);
        expect(caseBonusMot.bonusMot).to.be.a('number').to.equals(2);
        expect(caseBonusMot.estRemplieCeTour).to.be.a('boolean').to.equals(false);
        expect(caseBonusMot.lettreContenue.lettre).to.be.a('string').to.equals('');

        const caseBonusLettre = plateau[9][13];
        expect(caseBonusLettre.bonusLettre).to.be.a('number').to.equals(3);
        expect(caseBonusLettre.bonusMot).to.be.a('number').to.equals(1);
        expect(caseBonusLettre.estRemplieCeTour).to.be.a('boolean').to.equals(false);
        expect(caseBonusLettre.lettreContenue.lettre).to.be.a('string').to.equals('');

        done();
    });

    it('mot place dans le tableau', (done: Mocha.Done) => {
        expect(plateauJeu.interpreterCommande('place', { x: -1, y: -1 }, true).messageErreur)
            .to.be.a('string')
            .to.equals(ERREUR_HORS_PLATEAU);

        expect(plateauJeu.interpreterCommande('place', { x: 15, y: 15 }, true).messageErreur)
            .to.be.a('string')
            .to.equals(ERREUR_HORS_PLATEAU);

        expect(plateauJeu.interpreterCommande('place', { x: 0, y: 14 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_PLATEAU);

        reinitialiserPlateau();

        expect(plateauJeu.interpreterCommande('place', { x: 14, y: 14 }, false).messageErreur)
            .to.be.a('string')
            .to.equals(ERREUR_HORS_PLATEAU);

        reinitialiserPlateau();

        expect(plateauJeu.interpreterCommande('bon', { x: 7, y: 7 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_PLATEAU);

        plateauJeu.finirTour();

        expect(plateauJeu.interpreterCommande('1234567', { x: 6, y: 7 }, true).messageErreur)
            .to.be.a('string')
            .to.equals(ERREUR_HORS_PLATEAU);

        reinitialiserPlateau();

        done();
    });

    it('premiere lettre sur case vide', (done: Mocha.Done) => {
        plateauJeu.plateau[7][7].lettreContenue = new Lettre('a');
        expect(plateauJeu.interpreterCommande('place', { x: 7, y: 7 }, true).messageErreur)
            .to.be.a('string')
            .to.equals(ERREUR_CASE_NON_VIDE);

        expect(plateauJeu.interpreterCommande('place', { x: 7, y: 8 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_CASE_NON_VIDE);

        reinitialiserPlateau();

        done();
    });

    it('premier mot sur H8', (done: Mocha.Done) => {
        expect(plateauJeu.interpreterCommande('place', { x: 7, y: 3 }, true).messageErreur)
            .to.be.a('string')
            .to.equals(ERREUR_HORS_CENTRE);

        for (let i = 0; i < 'place'.length; i++) {
            expect(plateauJeu.plateau[7 + i][3].lettreContenue.lettre)
                .to.be.a('string')
                .to.equals('');
        }

        expect(plateauJeu.interpreterCommande('place', { x: 7, y: 3 }, false).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_CENTRE);

        for (let i = 0; i < 'place'.length; i++) {
            expect(plateauJeu.plateau[7][3 + i].lettreContenue.lettre)
                .to.be.a('string')
                .to.equals('place'.charAt(i));
        }

        plateauJeu.finirTour();

        expect(plateauJeu.interpreterCommande('plce', { x: 5, y: 5 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_CENTRE);

        for (let i = 0; i < 'place'.length; i++) {
            expect(plateauJeu.plateau[5 + i][5].lettreContenue.lettre)
                .to.be.a('string')
                .to.equals('place'.charAt(i));
        }

        reinitialiserPlateau();

        expect(plateauJeu.interpreterCommande('bon', { x: 6, y: 7 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_CENTRE);

        for (let i = 0; i < 'bon'.length; i++) {
            expect(plateauJeu.plateau[6 + i][7].lettreContenue.lettre)
                .to.be.a('string')
                .to.equals('bon'.charAt(i));
        }

        plateauJeu.finirTour();

        expect(plateauJeu.interpreterCommande('adant', { x: 5, y: 7 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_CENTRE);

        for (let i = 0; i < 'abondant'.length; i++) {
            expect(plateauJeu.plateau[5 + i][7].lettreContenue.lettre)
                .to.be.a('string')
                .to.equals('abondant'.charAt(i));
        }

        reinitialiserPlateau();

        done();
    });

    it('mots doivent etre adjacent apres le premier tour', (done: Mocha.Done) => {
        expect(plateauJeu.interpreterCommande('place', { x: 7, y: 3 }, false).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_CENTRE);

        plateauJeu.finirTour();

        expect(plateauJeu.interpreterCommande('place', { x: 7, y: 1 }, true).messageErreur)
            .to.be.a('string')
            .to.equals(ERREUR_NON_ADJACENT);

        expect(plateauJeu.interpreterCommande('place', { x: 8, y: 2 }, true).messageErreur)
            .to.be.a('string')
            .to.equals(ERREUR_NON_ADJACENT);

        expect(plateauJeu.interpreterCommande('place', { x: 8, y: 3 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_NON_ADJACENT);

        plateauJeu.finirTour();

        expect(plateauJeu.interpreterCommande('place', { x: 6, y: 5 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_NON_ADJACENT);

        reinitialiserPlateau();

        done();
    });

    it('detecte tout les mots crees', (done: Mocha.Done) => {
        expect(plateauJeu.interpreterCommande('bon', { x: 6, y: 7 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_CENTRE);

        expect(plateauJeu['motCrees'][0].extraireString()).to.be.a('string').to.equals('bon');
        expect({ x: plateauJeu['motCrees'][0].x, y: plateauJeu['motCrees'][0].y }).to.deep.equal({ x: 6, y: 7 });

        plateauJeu.finirTour();

        expect(plateauJeu.interpreterCommande('adant', { x: 5, y: 7 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_NON_ADJACENT);

        expect(plateauJeu['motCrees'][0].extraireString()).to.be.a('string').to.equals('abondant');
        expect({ x: plateauJeu['motCrees'][0].x, y: plateauJeu['motCrees'][0].y }).to.deep.equal({ x: 5, y: 7 });

        reinitialiserPlateau();

        expect(plateauJeu.interpreterCommande('bon', { x: 6, y: 7 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_CENTRE);

        expect(plateauJeu['motCrees'][0].extraireString()).to.be.a('string').to.equals('bon');
        expect({ x: plateauJeu['motCrees'][0].x, y: plateauJeu['motCrees'][0].y }).to.deep.equal({ x: 6, y: 7 });

        plateauJeu.finirTour();

        expect(plateauJeu.interpreterCommande('net', { x: 9, y: 7 }, true).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_NON_ADJACENT);

        expect(plateauJeu['motCrees'][0].extraireString()).to.be.a('string').to.equals('bonnet');
        expect({ x: plateauJeu['motCrees'][0].x, y: plateauJeu['motCrees'][0].y }).to.deep.equal({ x: 6, y: 7 });

        reinitialiserPlateau();

        expect(plateauJeu.interpreterCommande('derobe', { x: 7, y: 7 }, false).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_HORS_CENTRE);

        expect(plateauJeu['motCrees'][0].extraireString()).to.be.a('string').to.equals('derobe');
        expect({ x: plateauJeu['motCrees'][0].x, y: plateauJeu['motCrees'][0].y }).to.deep.equal({ x: 7, y: 7 });

        plateauJeu.finirTour();

        expect(plateauJeu.interpreterCommande('betises', { x: 8, y: 6 }, false).messageErreur)
            .to.be.a('string')
            .to.not.equals(ERREUR_NON_ADJACENT);

        expect(plateauJeu['motCrees'][0].extraireString()).to.be.a('string').to.equals('de');
        expect({ x: plateauJeu['motCrees'][0].x, y: plateauJeu['motCrees'][0].y }).to.deep.equal({ x: 7, y: 7 });
        expect(plateauJeu['motCrees'][0].estHorizontal).to.be.a('boolean').to.equals(true);

        expect(plateauJeu['motCrees'][1].extraireString()).to.be.a('string').to.equals('et');
        expect({ x: plateauJeu['motCrees'][1].x, y: plateauJeu['motCrees'][1].y }).to.deep.equal({ x: 7, y: 8 });
        expect(plateauJeu['motCrees'][1].estHorizontal).to.be.a('boolean').to.equals(true);

        expect(plateauJeu['motCrees'][5].extraireString()).to.be.a('string').to.equals('es');
        expect({ x: plateauJeu['motCrees'][5].x, y: plateauJeu['motCrees'][5].y }).to.deep.equal({ x: 7, y: 12 });
        expect(plateauJeu['motCrees'][5].estHorizontal).to.be.a('boolean').to.equals(true);

        expect(plateauJeu['motCrees'][6].extraireString()).to.be.a('string').to.equals('betises');
        expect({ x: plateauJeu['motCrees'][6].x, y: plateauJeu['motCrees'][6].y }).to.deep.equal({ x: 8, y: 6 });
        expect(plateauJeu['motCrees'][6].estHorizontal).to.be.a('boolean').to.equals(false);

        reinitialiserPlateau();

        done();
    });

    it('placer mots', (done: Mocha.Done) => {
        const placementInvalide = plateauJeu.interpreterCommande('abcd', { x: 7, y: 7 }, true);
        expect(placementInvalide.score).to.be.a('number').to.equals(MOT_INVALIDE);
        expect(JSON.parse(placementInvalide.resultat).motsInvalides).to.deep.equal(['abcd']);

        const placementBalle = plateauJeu.interpreterCommande('balle', { x: 3, y: 7 }, true);
        expect(placementBalle.score).to.be.a('number').to.equals(20);

        plateauJeu.finirTour();

        const placementTerreur = plateauJeu.interpreterCommande('terreur', { x: 7, y: 8 }, true);
        expect(placementTerreur.score).to.be.a('number').to.equals(61);

        plateauJeu.finirTour();

        const placementFete = plateauJeu.interpreterCommande('fE', { x: 7, y: 6 }, false);
        expect(placementFete.score).to.be.a('number').to.equals(6);

        plateauJeu.finirTour();
        const placementAfte = plateauJeu.interpreterCommande('Ate', { x: 6, y: 6 }, true);
        expect(placementAfte.score).to.be.a('number').to.equals(MOT_INVALIDE);
        expect(JSON.parse(placementAfte.resultat).motsInvalides).to.deep.equal(['Al', 'Afte']);

        reinitialiserPlateau();

        done();
    });
});
