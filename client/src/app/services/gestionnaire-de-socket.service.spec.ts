/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { Lettre } from '@app/classes/lettre';
import { Clavardage } from '@app/interfaces/clavardage';
import { Coordonnee } from '@app/interfaces/coordonnee';
import { InfoPartie } from '@app/interfaces/info-partie';
import { Observable, Subscriber } from 'rxjs';
import { GestionnaireDeSocketService } from './gestionnaire-de-socket.service';

describe('GestionnaireDeSocketService', () => {
    let service: GestionnaireDeSocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GestionnaireDeSocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('emit devrait etre appeller', () => {
        const spy = spyOn(service.socket, 'emit').and.callThrough();
        service.emit('test emit');
        expect(spy).toHaveBeenCalled();
    });

    it('getInfoPartie devrait etre appeller', () => {
        const spy = spyOn(service, 'getInfoPartie').and.callFake(() => {
            return new Observable<InfoPartie>();
        });
        service.getInfoPartie();
        expect(spy).toHaveBeenCalled();
    });

    it('getMessage devrait etre appeller', () => {
        const spy = spyOn(service, 'getMessages').and.callFake(() => {
            return new Observable<Clavardage>();
        });
        service.getMessages();
        service.emit('clavardagePartie', 'message de test');
        expect(spy).toHaveBeenCalled();
    });

    it(' incrementationDeObservableMessage devrait etre appeller', () => {
        const observer = new Subscriber<Clavardage>();
        const messageValider = { auteur: 'Auteur test', message: 'Message test' };
        const result = service['incrementationObservableMessage'](messageValider, observer);
        expect(result).toEqual(true);
    });

    it('getPlacementLettres devrait etre appeller', () => {
        const spy = spyOn(service, 'getPlacementLettres').and.callFake(() => {
            return new Observable<{ lettres: Lettre[]; coordonnees: Coordonnee[] }>();
        });
        service.getPlacementLettres();
        service.emit('clavardagePartie', '!placer test');
        expect(spy).toHaveBeenCalled();
    });

    // it('getMessages devrait appeller incrementationObservableMessage lors du event clavardagePartie', () => {
    //     const spy = spyOn(service, 'incrementationObservableMessage').and.callThrough();
    //     service.getMessages();
    //     socketHelper.peerSideEmit('clavardagePartie', JSON.stringify({auteur: 'testAuteur', message: 'testMessage'}));
    //     expect(spy).toHaveBeenCalled();
    // });

    it(' incrementationDeObservablePlacement devrait etre appeller', () => {
        const observer = new Subscriber<{ lettres: Lettre[]; coordonnees: Coordonnee[] }>();
        const reponseCommande = {
            idJoueur: 'auteurTest',
            nomJoueur: 'nomTest',
            type: 'placer',
            argument: 'h8h a',
            resultat: JSON.stringify([{ x: 1, y: 1 }], ['a']),
            succes: true,
            messageErreur: '',
            score: 0,
        };
        const result = service['incrementationObservablePlacement'](reponseCommande, observer);
        expect(result).toEqual(true);
    });

    it('reponsePlacementInvalide devrait donner la bonne string', () => {
        const test1Mot = service['reponsePlacementInvalide'](['test']);
        expect(test1Mot).toEqual('test');
        const test2Mots = service['reponsePlacementInvalide'](['test1', 'test2']);
        expect(test2Mots).toEqual('test1 et test2');
        const test3Mots = service['reponsePlacementInvalide'](['test1', 'test2', 'test3']);
        expect(test3Mots).toEqual('test1, test2, et test3');
        const test4Mots = service['reponsePlacementInvalide'](['test1', 'test2', 'test3', 'test4']);
        expect(test4Mots).toEqual('test1, test2, test3, et test4');
    });

    it('determinerMessage devrait retourner le bon message pour passer', () => {
        const passerTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'passer',
            argument: '',
            resultat: '',
            succes: true,
            messageErreur: '',
            score: 0,
        };
        expect(service['determinerMessage'](passerTest).message).toEqual(passerTest.nomJoueur + ' a passé son tour.');
    });

    it('determinerMessage devrait retourner le bon message pour echanger si le joueur a envoye', () => {
        const echangerTest = {
            idJoueur: service.socket.id,
            nomJoueur: 'nomTest',
            type: 'echanger',
            argument: 'abc',
            resultat: 'def',
            succes: true,
            messageErreur: '',
            score: 0,
        };
        expect(service['determinerMessage'](echangerTest).message).toEqual(
            echangerTest.nomJoueur + ' a échangé les lettres: ' + echangerTest.argument.split(' ')[0],
        );
    });

    it('determinerMessage devrait retourner le bon message pour echanger si le joueur virtuel a envoye', () => {
        const echangerTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'echanger',
            argument: 'abc',
            resultat: 'def',
            succes: true,
            messageErreur: '',
            score: 0,
        };
        expect(service['determinerMessage'](echangerTest).message).toEqual(
            echangerTest.nomJoueur + ' a échangé ' + echangerTest.argument.split(' ')[0].length + ' lettres.',
        );
    });

    it('determinerMessage devrait retourner le bon message pour reserve', () => {
        const reserveTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'reserve',
            argument: '',
            resultat:
                // eslint-disable-next-line max-len
                'a : 9\nb : 2\nc : 2\nd : 3\ne : 15\nf : 2\ng : 2\nh : 2\ni : 8\nj : 1\nk : 1\nl : 5\nm : 3\nn : 6\no : 6\np : 2\nq : 1\nr : 6\ns : 6\nt : 6\nu : 6\nv : 2\nw : 1\nx : 1\ny : 1\nz : 1\n* : 2\n',
            succes: false,
            messageErreur: '',
            score: 0,
        };

        expect(service['determinerMessage'](reserveTest).message).toContain(
            // eslint-disable-next-line max-len
            'a : 9\nb : 2\nc : 2\nd : 3\ne : 15\nf : 2\ng : 2\nh : 2\ni : 8\nj : 1\nk : 1\nl : 5\nm : 3\nn : 6\no : 6\np : 2\nq : 1\nr : 6\ns : 6\nt : 6\nu : 6\nv : 2\nw : 1\nx : 1\ny : 1\nz : 1\n* : 2\n',
        );
    });

    it('determinerMessage devrait afficher le message erreur si la commande reserve est invalide', () => {
        const reserveTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'reserve',
            argument: 'abc',
            resultat: '',
            succes: false,
            messageErreur: "Pour voir l'état de la réserve, écrivez simplement ceci: !reserve. Veuilez réessayer:",
            score: 0,
        };

        expect(service['determinerMessage'](reserveTest).message).toContain(
            "Pour voir l'état de la réserve, écrivez simplement ceci: !reserve. Veuilez réessayer:",
        );
    });

    it('determinerMessage devrait retourner le bon message pour placer', () => {
        const placerTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'placer',
            argument: 'h8h test',
            resultat: '',
            succes: true,
            messageErreur: '',
            score: 90,
        };
        expect(service['determinerMessage'](placerTest).message).toEqual(
            placerTest.nomJoueur + ' a placé les lettres: ' + placerTest.argument.split(' ')[1] + ' et a obtenu ' + placerTest.score + ' points!',
        );

        placerTest.score = -1;
        placerTest.resultat = JSON.stringify({ motsInvalides: ['jshs', 'hdud', 'ss'] });
        expect(service['determinerMessage'](placerTest).message).toEqual(
            placerTest.nomJoueur +
                ' a placé les lettres: ' +
                placerTest.argument.split(' ')[1] +
                ' est a créé les mots invalides: ' +
                service['reponsePlacementInvalide'](JSON.parse(placerTest.resultat).motsInvalides) +
                '. Aucun point obtenu!',
        );
    });

    it('determinerMessage devrait retourner le bon message pour commande inexistante', () => {
        const passerTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'salut',
            argument: 'abc',
            resultat: 'def',
            succes: false,
            messageErreur: 'blabla',
            score: 0,
        };
        expect(service['determinerMessage'](passerTest).message).toEqual(passerTest.messageErreur);
    });
});
