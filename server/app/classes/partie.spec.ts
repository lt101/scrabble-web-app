/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ConfigPartie } from '@app/interfaces/config-partie';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Joueur } from './joueur';
import { Lettre } from './lettre';
import { EtatPartie, Partie } from './partie';

describe('Partie', () => {
    let partieTest: Partie;
    let configuration: ConfigPartie;
    let stubRandom: sinon.SinonStub<[], number>;

    beforeEach(() => {
        configuration = {
            mode: 'Classique',
            option: 'solo',
            joueurs: [new Joueur('test', 'YOLO'), new Joueur('test2', 'YOLO2')],
            minuterie: 0,
        };
        partieTest = new Partie(configuration, '');
        stubRandom = sinon.stub(Math, 'random');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('traiterCommande devrait appeler determinerCommande', () => {
        const spyDeterminer = sinon.spy(partieTest['commandeService'], 'determinerCommande');
        const commandeTest = {
            type: 'placer',
            argument: 'testMessage',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        partieTest.partie.joueurActif.id = 'idJoueurPourTest5454511556';
        partieTest.traiterCommande(commandeTest);

        expect(spyDeterminer.calledOnce).to.equal(true);
        expect(spyDeterminer.calledWith(commandeTest)).to.equal(true);
    });

    it('avancerEtat devrait faire avancer etat', () => {
        expect(partieTest.etat).to.equal(EtatPartie.TourJoueur1);
        partieTest['avancerEtat']();
        expect(partieTest.etat).to.equal(EtatPartie.TourJoueur2);
        partieTest['avancerEtat']();
        expect(partieTest.etat).to.equal(EtatPartie.TourJoueur1);
        partieTest['avancerEtat']();
        expect(partieTest.etat).to.equal(EtatPartie.TourJoueur2);
        partieTest['nombreToursPasses'] = 6;
        partieTest['avancerEtat']();
        expect(partieTest.etat).to.equal(EtatPartie.FinPartie);
    });

    it('les points devraient etre correctement attribues quand 6 tours sont passees', () => {
        expect(partieTest.etat).to.equal(EtatPartie.TourJoueur1);
        partieTest['nombreToursPasses'] = 6;
        partieTest.partie.joueurs[0].pointage = 5;
        partieTest.partie.joueurs[0].chevalet.lettres = [new Lettre('z')];
        partieTest.partie.joueurs[1].pointage = 15;
        partieTest.partie.joueurs[1].chevalet.lettres = [new Lettre('z'), new Lettre('a'), new Lettre('*')];
        partieTest.partie.joueurs[1].nom = 'test2';
        partieTest.partie.joueurs[1].id = 'JoueurNonVirtuel';
        partieTest['avancerEtat']();
        expect(partieTest.etat).to.equal(EtatPartie.FinPartie);
        expect(partieTest.partie.joueurs[0].pointage).to.equal(0);
        expect(partieTest.partie.joueurs[1].pointage).to.equal(4);
        expect(partieTest.finPartie.message).to.equal(
            '6 tours de suite ont été passés!\n' +
                'Fin de partie - lettres restantes\n' +
                'test : z\n' +
                'test2 : za*\n' +
                'test perd 5 points!\n' +
                'test2 perd 11 points!\n',
        );
        expect(partieTest.finPartie.nomGagnant).to.equal('test2');
        expect(partieTest.finPartie.scores.length).to.equal(2);
        expect(partieTest.finPartie.scores[0]).to.deep.equal({ nom: ['test'], score: 0 });
        expect(partieTest.finPartie.scores[1]).to.deep.equal({ nom: ['test2'], score: 4 });
    });

    it('les points devraient etre correctement attribues quand la reserve et 1 chevalets sont vides', () => {
        expect(partieTest.etat).to.equal(EtatPartie.TourJoueur1);
        partieTest['commandeService'].echangeLettreService.reserve.reserveLettres = [];
        partieTest.partie.joueurs[0].pointage = 5;
        partieTest.partie.joueurs[0].chevalet.lettres = [];
        partieTest.partie.joueurs[1].pointage = 15;
        partieTest.partie.joueurs[1].chevalet.lettres = [new Lettre('z'), new Lettre('a'), new Lettre('*')];
        partieTest.partie.joueurs[1].nom = 'test2';
        partieTest.partie.joueurs[1].id = 'JoueurNonVirtuel';
        partieTest['avancerEtat']();
        expect(partieTest.etat).to.equal(EtatPartie.FinPartie);
        expect(partieTest.partie.joueurs[0].pointage).to.equal(16);
        expect(partieTest.partie.joueurs[1].pointage).to.equal(4);
        expect(partieTest.finPartie.message).to.equal(
            'Le chevalet de test et la réserve sont vides!\n' +
                'Fin de partie - lettres restantes\n' +
                'test : \n' +
                'test2 : za*\n' +
                'test gagne 11 points!\n' +
                'test2 perd 11 points!\n',
        );
        expect(partieTest.finPartie.nomGagnant).to.equal('test');
        expect(partieTest.finPartie.scores.length).to.equal(2);
        expect(partieTest.finPartie.scores[0]).to.deep.equal({ nom: ['test'], score: 16 });
        expect(partieTest.finPartie.scores[1]).to.deep.equal({ nom: ['test2'], score: 4 });
    });

    it('les points du joeurs virtuel ne devraient pas etre envoye a la base de donnees', () => {
        expect(partieTest.etat).to.equal(EtatPartie.TourJoueur1);
        partieTest['nombreToursPasses'] = 6;
        partieTest.partie.joueurs[0].pointage = 5;
        partieTest.partie.joueurs[0].chevalet.lettres = [new Lettre('z')];
        partieTest.partie.joueurs[1].pointage = 15;
        partieTest.partie.joueurs[1].chevalet.lettres = [new Lettre('z'), new Lettre('a'), new Lettre('*')];
        partieTest.partie.joueurs[1].id = 'JoueurVirtuel';
        partieTest['avancerEtat']();
        expect(partieTest.finPartie.scores.length).to.equal(1);
        expect(partieTest.finPartie.scores[0]).to.deep.equal({ nom: ['test'], score: 0 });
    });

    it('devrait traiter la commande reserve peu importe le joueur actif', () => {
        const commandeTest = {
            idJoueur: 'testJoueur',
            nomJoueur: 'nomTest',
            idPartie: 'testIdPartie',
            type: 'reserve',
            argument: '',
        };
        const spyDeterminer = sinon.spy(partieTest['commandeService'], 'determinerCommande');
        partieTest.partie.joueurActif.id = 'pasTestJoueur';
        partieTest.traiterCommande(commandeTest);
        expect(spyDeterminer.calledOnce).to.equal(true);
    });

    it('passer avec succes devrait appeler avancerEtat', () => {
        const commandeTest = {
            idJoueur: 'testJoueur',
            nomJoueur: 'nomTest',
            idPartie: 'testIdPartie',
            type: 'passer',
            argument: '',
        };
        const spyAvancerEtat = sinon.spy(partieTest, <any>'avancerEtat');
        partieTest.partie.joueurActif.id = commandeTest.idJoueur;
        partieTest.traiterCommande(commandeTest);
        expect(spyAvancerEtat.calledOnce).to.equal(true);
    });

    it('echanger avec succes devrait appeler avancerEtat', () => {
        const commandeTest = {
            idJoueur: 'testJoueur',
            nomJoueur: 'nomTest',
            idPartie: 'testIdPartie',
            type: 'echanger',
            argument: '',
        };
        for (let i = 0; i < 3; i++) {
            commandeTest.argument = commandeTest.argument + partieTest.partie.joueurActif.chevalet.lettres[i].lettre;
        }
        const spyAvancerEtat = sinon.spy(partieTest, <any>'avancerEtat');
        partieTest.partie.joueurActif.id = commandeTest.idJoueur;
        partieTest.traiterCommande(commandeTest);
        expect(spyAvancerEtat.calledOnce).to.equal(true);
    });

    it('commande avec echec devrait pas appeler avancerEtat', () => {
        const commandeTest = {
            idJoueur: 'testJoueur',
            nomJoueur: 'nomTest',
            idPartie: 'testIdPartie',
            type: 'passer',
            argument: '',
        };
        const spyAvancerEtat = sinon.spy(partieTest, <any>'avancerEtat');
        partieTest.partie.joueurActif.id = 'rien';
        partieTest.traiterCommande(commandeTest);
        expect(spyAvancerEtat.calledOnce).to.equal(false);
    });

    it('tourJoueurVirtuel devrait traiter une commande passer', () => {
        const spyTraiterCommande = sinon.spy(partieTest, 'traiterCommande');
        stubRandom.returns(0.05);
        partieTest.partie.joueurActif.id = 'JoueurVirtuel';
        partieTest.tourJoueurVirtuel();
        expect(spyTraiterCommande.calledOnce).to.equal(true);
    });

    it('tourJoueurVirtuel devrait traiter une commande echanger', () => {
        const spyTraiterCommande = sinon.spy(partieTest, 'traiterCommande');
        stubRandom.returns(0.15);
        partieTest.partie.joueurActif.id = 'JoueurVirtuel';
        partieTest.tourJoueurVirtuel();
        expect(spyTraiterCommande.calledOnce).to.equal(true);
    });

    it('tourJoueurVirtuel devrait traiter une commande placer', () => {
        const spyTraiterCommande = sinon.spy(partieTest, 'traiterCommande');
        stubRandom.returns(0.5);
        partieTest.partie.joueurActif.id = 'JoueurVirtuel';
        partieTest.tourJoueurVirtuel();
        expect(spyTraiterCommande.calledOnce).to.equal(true);
    });

    it('tourJoueurVirtuel devrait passer le tour si la reserve a moins de 7 lettres', () => {
        stubRandom.returns(0.15);
        partieTest['commandeService'].echangeLettreService.reserve.reserveLettres = ['a'];
        partieTest.partie.joueurActif.id = 'JoueurVirtuel';
        expect(partieTest.tourJoueurVirtuel().type).to.equal('passer');
    });

    it("traiterCommande devrait renvoyer un message d'erreur si la partie est terminee", () => {
        partieTest.etat = EtatPartie.FinPartie;
        const commandeTest = {
            idJoueur: 'testJoueur',
            nomJoueur: 'nomTest',
            idPartie: 'testIdPartie',
            type: 'passer',
            argument: '',
        };
        expect(partieTest.traiterCommande(commandeTest).messageErreur).to.equal(
            'La partie est terminée. Vous ne pouvez plus jouer, mais vous pouvez continuer à clavarder.',
        );
    });
});
