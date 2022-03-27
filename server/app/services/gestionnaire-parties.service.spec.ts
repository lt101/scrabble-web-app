import { Joueur } from '@app/classes/joueur';
import { Partie } from '@app/classes/partie';
import { ConfigPartie } from '@app/interfaces/config-partie';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { GestionnairePartiesService } from './gestionnaire-parties.service';

describe('GestionnairePartiesService', () => {
    let gestionnairePartiesService: GestionnairePartiesService;
    let configuration: ConfigPartie;

    beforeEach(() => {
        configuration = {
            mode: 'Classique',
            option: 'solo',
            joueurs: [new Joueur('YOLO', '')],
            minuterie: 0,
        };
        gestionnairePartiesService = new GestionnairePartiesService();
        gestionnairePartiesService.creerPartie('idPartie', configuration);
    });

    it('creerPartie ajoute une partie dans la map', () => {
        expect(gestionnairePartiesService.parties.size).to.equal(1);
    });

    it('acheminerCommande devrait appeler traiterCommande', () => {
        const commandeTest = {
            idJoueur: 'testJoueur',
            nomJoueur: 'nomTest',
            idPartie: 'testIdPartie',
            type: 'passer',
            argument: '',
        };
        const partieTest = new Partie(configuration, '');
        gestionnairePartiesService.parties.set('testIdPartie', partieTest);
        const traiterSpy = sinon.spy(partieTest, 'traiterCommande');
        gestionnairePartiesService.acheminerCommande(commandeTest);
        expect(traiterSpy.calledOnce).to.equal(true);
    });

    it('acheminer commande retourne undefined si la map ne contient pas la partie', () => {
        const commandeTest = {
            idJoueur: 'testJoueur',
            nomJoueur: 'nomTest',
            idPartie: '',
            type: 'passer',
            argument: '',
        };
        gestionnairePartiesService.parties.set('idPartie', new Partie(configuration, ''));
        expect(gestionnairePartiesService.acheminerCommande(commandeTest)).to.be.equal(undefined);
    });
});
