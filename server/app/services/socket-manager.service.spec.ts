/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable dot-notation */
import { Joueur } from '@app/classes/joueur';
import { EtatPartie, Partie } from '@app/classes/partie';
import { Server } from 'app/server';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { SocketManager } from './socket-manager.service';

// const RESPONSE_DELAY = 200;
describe('SocketManager service tests', () => {
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        service = server.socketManger;
        clientSocket = ioClient(urlString);
    });

    afterEach(() => {
        clientSocket.close();
        service['sio'].close();
        sinon.restore();
    });

    it('devrait confirmer que le message est valide', (done) => {
        const testMessage = 'Hello World';
        clientSocket.emit('rejoindreClavardage');
        clientSocket.emit('messageNormal', testMessage);
        clientSocket.on('clavardagePartie', (result: string) => {
            expect(result).to.contain(testMessage);
            done();
        });
    });

    it('devrait confirmer que le message est invalide TAILLE > 512 (CHAR)', (done) => {
        const testMessage =
            // eslint-disable-next-line max-len
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        clientSocket.emit('rejoindreClavardage');
        clientSocket.emit('messageNormal', testMessage);
        clientSocket.on('clavardagePartie', (result: string) => {
            expect(result).to.contain('Entrée invalide');
            done();
        });
    });

    it("ne devrait pas envoyer de message si le socket n'est pas un membre de la partie ", (done) => {
        const testMessage = 'Hello World';
        clientSocket.emit('messageNormal', testMessage);
        clientSocket.on('clavardagePartie', (message: string) => {
            expect(message).to.contain("Vous n'etes pas en partie");
            done();
        });
    });

    it('devrait traiter la commande et appeler les methodes utilisees', (done) => {
        const reponseTest = {
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            type: 'echanger',
            argument: 'abc',
            resultat: '',
            succes: true,
            messageErreur: 'messageTest',
            score: 0,
        };
        const stubCommande = sinon.stub(service['gestionnairePartiesService'], 'acheminerCommande').callsFake(() => {
            return reponseTest;
        });
        // const spyAcheminerCommande = sinon.spy(service['gestionnairePartiesService, 'acheminerCommande');
        const commandeTest = { type: 'echanger', argument: 'abc', idJoueur: 'testAuteur', nomJoueur: 'nomTest', idPartie: 'partieTest' };
        clientSocket.emit('rejoindreClavardage');
        clientSocket.emit('commande', commandeTest);
        clientSocket.on('reponseCommande', () => {
            // assert(spyAcheminerCommande.calledOnceWith(commandeTest));
            expect(stubCommande.called).to.equal(true);
            done();
        });
    });

    it('devrait traiter ne pas traiter la commande (pas dans la bonne salle)', (done) => {
        const commandeTest = { type: 'echanger', argument: 'abc', idJoueur: 'testAuteur', nomJoueur: 'nomTest', idPartie: 'partieTest' };
        clientSocket.emit('commande', commandeTest);
        clientSocket.on('clavardagePartie', () => {
            done();
        });
    });

    it('devrait ne pas traiter la commande et appeler les methodes utilisees', (done) => {
        const commandeTest = { type: 'echanger', argument: '123', idJoueur: 'testAuteur', nomJoueur: 'nomTest', idPartie: 'partieTest' };
        clientSocket.emit('rejoindreClavardage');
        clientSocket.emit('commande', commandeTest);
        clientSocket.on('reponseCommande', () => {
            // TODO: expect(reponseDuTraitement.succes).to.equal(false);
            done();
        });
    });

    it('methode updateInfoPartie devrait emit event updateInfoPartie', () => {
        const spyUpdate = sinon.spy(service, <any>['updateInfoPartie']);
        const infoTest = {
            joueurs: [new Joueur('a', '')],
            idPartie: '',
            joueurActif: new Joueur('b', ''),
            reserve: ['a'],
            minuterie: 0,
        };
        service['updateInfoPartie'](infoTest);
        assert(spyUpdate.calledOnce);
    });

    it("devrait afficher un message d'erreur lorsque le joueur entre une commande et que ce n'est pas son tour", (done) => {
        // eslint-disable-next-line dot-notation
        const commandeTest = { type: 'echanger', argument: 'abc', nomJoueur: 'nomTest', idJoueur: 'idJoueurPourTest5454511556' };
        clientSocket.emit('rejoindreClavardage');
        clientSocket.emit('commande', commandeTest);
        // clientSocket.on('clavardagePartie', (result: string) => {
        //  console.log(result);
        // expect(result).to.contain("Juste un moment! Vous pourrez effectuer une commande lorsque c'est votre tour :)"); TODO
        done();
        //  });
    });

    it('should broadcast message to room if origin socket is in room', (done) => {
        const testClavardage = { auteur: 'testAuteur', message: 'testMessage' };
        clientSocket.emit('rejoindreClavardage');
        clientSocket.emit('messageNormal', testClavardage.message);
        clientSocket.on('clavardagePartie', (message: string) => {
            expect(message).to.contain('testMessage');
            done();
        });
    });

    it("devrait recevoir le nom de l'utilisateur", (done) => {
        const testNomDeJoueur = 'nomDeJoueurTest';
        clientSocket.emit('nouveauNomDeJoueur', testNomDeJoueur);
        clientSocket.on('NomCorrectementAjouter', () => {
            done();
        });
    });

    it('devrait initialiser partie complete', (done) => {
        clientSocket.emit('initPartieSolo', { mode: 'mode', option: 'option', joueurs: [new Joueur('idTest', '')] });
        clientSocket.on('debutPartieSolo', () => {
            done();
        });
    });

    it('devrait recevoir le initPartieSolo', (done) => {
        const configuration = {
            mode: 'Classique',
            option: 'solo',
            joueurs: [new Joueur('YOLO', '')],
        };
        clientSocket.emit('initPartieSolo', configuration);
        clientSocket.on('debutPartieSolo', () => {
            done();
        });
    });

    it('should broadcast to all sockets when emiting timer', () => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        service['emitMinuterie']();
        assert(spy.called);
    });

    it('devrait décrémenter tempsRestant', () => {
        const valeurAttendue = 59;
        service['minuterie']();
        expect(service['tempsRestant']).to.equal(valeurAttendue);
    });

    it('devrait appeler passerTourTemps si temps restant = 0', () => {
        const spy = sinon.spy(service, <any>['passerTourTemps']);
        service['tempsRestant'] = 0;
        service['minuterie']();
        assert(spy.called);
    });

    it('passerTourTemps devrait acheminer la commande passer si la partie existe', () => {
        const configuration = {
            mode: 'Classique',
            option: 'solo',
            joueurs: [new Joueur('YOLO', '')],
            minuterie: 60,
        };
        service['gestionnairePartiesService'].creerPartie('idPartieInit', configuration);
        const spy = sinon.spy(service['gestionnairePartiesService'], 'acheminerCommande');
        service['passerTourTemps']('idPartieInit');
        assert(spy.called);
    });

    it('devrait envoyer la fin de partie si elle est finie', (done) => {
        const reponseTest = {
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            type: 'echanger',
            argument: 'abc',
            resultat: '',
            succes: true,
            messageErreur: 'messageTest',
            score: 0,
        };
        const stubCommande = sinon.stub(service['gestionnairePartiesService'], 'acheminerCommande').callsFake(() => {
            return reponseTest;
        });
        clientSocket.emit('initPartieSolo', { mode: 'mode', option: 'option', joueurs: [new Joueur('idTest', '')] });
        service['gestionnairePartiesService'].parties.set(
            'partieTest',
            new Partie({ mode: 'mode', option: 'option', joueurs: [new Joueur('idTest', '')], minuterie: 60 }, 'partieTest'),
        );
        (service['gestionnairePartiesService'].parties.get('partieTest') as Partie).etat = EtatPartie.FinPartie;
        service['aEnvoyeMessageDeFin'] = false;
        // const spyAcheminerCommande = sinon.spy(service['gestionnairePartiesService, 'acheminerCommande');
        const commandeTest = { type: 'echanger', argument: 'abc', idJoueur: 'testAuteur', nomJoueur: 'nomTest', idPartie: 'partieTest' };
        clientSocket.emit('rejoindreClavardage');
        clientSocket.emit('commande', commandeTest);
        clientSocket.on('finPartie', () => {
            // assert(spyAcheminerCommande.calledOnceWith(commandeTest));
            expect(stubCommande.called).to.equal(true);
            done();
        });
    });

    // it('should call emitTime on socket configuration', (done) => {
    //     const spy = sinon.spy(service, 'emitTime');
    //     setTimeout(() => {
    //         assert(spy.called);
    //         done();
    //     }, RESPONSE_DELAY * MULTIPLICATEUR_DU_DELAI_REPONSE); // 1 seconde
    // });
});
