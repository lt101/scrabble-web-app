import { TestBed } from '@angular/core/testing';
import { Joueur } from '@app/classes/joueur';
import { InfoPartie } from '@app/interfaces/info-partie';
import { GestionnaireDeCommandeService } from './gestionnaire-de-commande.service';
import { GestionnaireDeSocketService } from './gestionnaire-de-socket.service';

describe('GestionnaireDeCommandeService', () => {
    let serviceSocket: GestionnaireDeSocketService;
    let service: GestionnaireDeCommandeService;
    let partie: InfoPartie;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GestionnaireDeCommandeService);
        serviceSocket = TestBed.inject(GestionnaireDeSocketService);
        partie = { joueurs: [new Joueur('joueurTest', '')], idPartie: 'idPartieTest', joueurActif: new Joueur('joueurTest', ''), reserve: [] };
        serviceSocket.partie = partie;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('envoyerCommande devrait envoyer une commande sans argument', () => {
        const messageDeCommande = '!passer';
        const spy = spyOn(service, 'envoyerCommande').and.callThrough();
        service.envoyerCommande(messageDeCommande);
        expect(spy).toHaveBeenCalled();
    });
    it('envoyerCommande devrait envoyer une commande avec argument', () => {
        const messageDeCommande = '!echanger abc';
        const spy = spyOn(service, 'envoyerCommande').and.callThrough();
        service.envoyerCommande(messageDeCommande);
        expect(spy).toHaveBeenCalledWith(messageDeCommande);
    });
});
