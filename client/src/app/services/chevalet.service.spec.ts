/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ElementRef, QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Chevalet } from '@app/classes/chevalet';
import { Lettre } from '@app/classes/lettre';
import { PAS_SELECT } from '@app/constantes/chevalet.service.constantes';
import { ChevaletService } from './chevalet.service';
import { GestionnaireDeCommandeService } from './gestionnaire-de-commande.service';
import { GestionnaireDeSocketService } from './gestionnaire-de-socket.service';

describe('ChevaletService', () => {
    let service: ChevaletService;
    let socketService: GestionnaireDeSocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChevaletService);
        socketService = TestBed.inject(GestionnaireDeSocketService);
        service.chevalet.lettres = [];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('ajouterLettres devrait mettre les bonnes choses sur le chevalet', () => {
        const spyUpdate = spyOn(service, <any>['updateVue']).and.callFake(() => {
            return;
        });
        service.ajouterLettres('abc*');
        expect(service.chevalet.lettres).toEqual([new Lettre('a'), new Lettre('b'), new Lettre('c'), new Lettre('*')]);
        service.ajouterLettres('cdef');
        expect(service.chevalet.lettres).toEqual([
            new Lettre('a'),
            new Lettre('b'),
            new Lettre('c'),
            new Lettre('*'),
            new Lettre('c'),
            new Lettre('d'),
            new Lettre('e'),
        ]);
        expect(spyUpdate).toHaveBeenCalled();
    });

    it('retirerLettres devrait enlever les bonnes choses du chevalet', () => {
        const spyUpdate = spyOn(service, <any>['updateVue']).and.callFake(() => {
            return;
        });
        service.ajouterLettres('abc*azz');
        service.retirerLettres('aczd*');
        expect(service.chevalet.lettres).toEqual([new Lettre('b'), new Lettre('a'), new Lettre('z')]);
        expect(spyUpdate).toHaveBeenCalled();
    });

    it('retirerLettres devrait rien faire si le chevalet est vide', () => {
        const spyUpdate = spyOn(service, <any>['updateVue']).and.callFake(() => {
            return;
        });
        service.chevalet = new Chevalet();
        service.retirerLettres('aczd*');
        expect(service.chevalet.lettres).toEqual([]);
        expect(spyUpdate).toHaveBeenCalled();
    });

    it('selectionnerManip devrait choisir la nouvelle lettre a manipuler', () => {
        service.selectEchange = [1, 2];
        service.selectManip = 0;
        service.selectionnerManip(1);
        expect(service.selectManip).toEqual(1);
        expect(service.selectEchange).toEqual([]);
    });

    it('selectionnerManip devrait deselctionner la lettre deja selectionnee', () => {
        service.selectEchange = [2];
        service.selectManip = 1;
        service.selectionnerManip(1);
        expect(service.selectManip).toEqual(-1);
        expect(service.selectEchange).toEqual([]);
    });

    it('estSelectionEchange devrait retourner true si index est dans selectEchange', () => {
        service.selectEchange = [1, 2, 3];
        expect(service.estSelectionEchange(1)).toBeTrue();
    });

    it('estSelectionEchange devrait retourner false si index est pas dns selectEchange', () => {
        service.selectEchange = [1, 2, 3];
        expect(service.estSelectionEchange(5)).toBeFalse();
    });

    it('selectionnerEchange devrait changer selectEchange et mettre selectManip à -1', () => {
        service.selectManip = 3;
        const event = new Event('contextmenu');
        service.selectionnerEchange(event, 0);
        expect(service.selectEchange).toContain(0);
        expect(service.selectManip).toEqual(-1);
        service.selectionnerEchange(event, 1);
        service.selectionnerEchange(event, 2);
        expect(service.selectEchange).toContain(0);
        expect(service.selectEchange).toContain(1);
        expect(service.selectEchange).toContain(2);
        service.selectionnerEchange(event, 2);
        expect(service.selectEchange).toContain(0);
        expect(service.selectEchange).toContain(1);
        expect(service.selectEchange).not.toContain(2);
    });

    it('selectionnerClavier devrait modifier selectManip avec le bon index', () => {
        service.chevalet = new Chevalet();
        service.chevalet.ajouterLettre(new Lettre('e'));
        service.chevalet.ajouterLettre(new Lettre('e'));
        service.chevalet.ajouterLettre(new Lettre('e'));
        service.chevalet.ajouterLettre(new Lettre('e'));
        service.chevalet.ajouterLettre(new Lettre('e'));
        service.chevalet.ajouterLettre(new Lettre('e'));
        service.chevalet.ajouterLettre(new Lettre('e'));
        service.selectionnerClavier('e');
        expect(service.selectManip).toEqual(0);
        service.selectionnerClavier('e');
        expect(service.selectManip).toEqual(1);
        service.selectionnerClavier('e');
        expect(service.selectManip).toEqual(2);
        service.selectionnerClavier('e');
        expect(service.selectManip).toEqual(3);
        service.selectionnerClavier('e');
        expect(service.selectManip).toEqual(4);
        service.selectionnerClavier('e');
        expect(service.selectManip).toEqual(5);
        service.selectionnerClavier('e');
        expect(service.selectManip).toEqual(6);
        service.selectionnerClavier('e');
        expect(service.selectManip).toEqual(0);
        expect(service.selectionnerClavier('g')).toBeFalse();
    });

    it("deplacerLettre devrait changer l'ordre du chevalet", () => {
        const spyUpdate = spyOn(service, <any>['updateVue']).and.callFake(() => {
            return;
        });
        service.chevalet = new Chevalet();
        service.chevalet.ajouterLettre(new Lettre('e'));
        service.chevalet.ajouterLettre(new Lettre('y'));
        service.chevalet.ajouterLettre(new Lettre('s'));
        service.chevalet.ajouterLettre(new Lettre('t'));
        service.chevalet.ajouterLettre(new Lettre('u'));
        service.chevalet.ajouterLettre(new Lettre('v'));
        service.chevalet.ajouterLettre(new Lettre('a'));
        service.selectManip = PAS_SELECT;
        service.deplacerLettre(true);
        service.selectManip = 0;
        service.deplacerLettre(true);
        expect(service.selectManip).toEqual(6);
        expect(service.chevalet.lettres[0].lettre).toEqual('a');
        service.deplacerLettre(false);
        expect(service.selectManip).toEqual(0);
        expect(service.chevalet.lettres[0].lettre).toEqual('e');
        service.deplacerLettre(false);
        expect(service.selectManip).toEqual(1);
        expect(service.chevalet.lettres[0].lettre).toEqual('y');
        expect(spyUpdate).toHaveBeenCalled();
    });

    it('afficherLettre devrait modifier les propriétés du nativeElement', () => {
        const htmlElement = document.createElement('div');
        const lettre = document.createElement('div');
        lettre.className = 'valeur';
        const pointage = document.createElement('div');
        pointage.className = 'pointage';
        htmlElement.appendChild(lettre);
        htmlElement.appendChild(pointage);
        const elementRef = new ElementRef(htmlElement);

        service.chevalet = new Chevalet();
        service.chevalet.ajouterLettre(new Lettre('a'));
        service.chevalet.ajouterLettre(new Lettre('b'));
        service.chevalet.ajouterLettre(new Lettre('z'));
        service.chevalet.ajouterLettre(new Lettre('*'));

        service['afficherLettre'](elementRef, 0);
        expect(elementRef.nativeElement.style.visibility).toEqual('visible');
        expect(elementRef.nativeElement.getElementsByClassName('valeur')[0].innerHTML).toEqual('A');
        expect(elementRef.nativeElement.getElementsByClassName('pointage')[0].innerHTML).toEqual('1');

        service['afficherLettre'](elementRef, 6);
        expect(elementRef.nativeElement.style.visibility).toEqual('hidden');

        expect(service['afficherLettre'](undefined, 0)).toBeFalse();

        service['afficherLettre'](elementRef, 3);
        expect(elementRef.nativeElement.getElementsByClassName('valeur')[0].innerHTML).toEqual('');
        expect(elementRef.nativeElement.getElementsByClassName('pointage')[0].innerHTML).toEqual('');
    });

    it('updateVue devrait appeler afficherLettre', () => {
        service.lettres = new QueryList<ElementRef>();
        const spyAfficher = spyOn(service, <any>['afficherLettre']);
        service['updateVue']();
        expect(spyAfficher).toHaveBeenCalled();
    });

    it('updateApresEchange devrait appeler updateVue si il y a echange avec succes', () => {
        socketService.socket.id = 'idTest';
        const reponseTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'echanger',
            argument: 'abc',
            resultat: 'def',
            succes: true,
            messageErreur: '',
            score: 0,
        };

        const chevalet = new Chevalet();
        chevalet.ajouterLettre(new Lettre('e'));
        chevalet.ajouterLettre(new Lettre('y'));
        chevalet.ajouterLettre(new Lettre('s'));
        chevalet.ajouterLettre(new Lettre('t'));
        chevalet.ajouterLettre(new Lettre('u'));
        chevalet.ajouterLettre(new Lettre('v'));
        chevalet.ajouterLettre(new Lettre('a'));

        reponseTest.resultat += ' ' + JSON.stringify(chevalet);
        const spyUpdate = spyOn(service, <any>['updateVue']).and.callFake(() => {
            return;
        });
        service['updateApresEchange'](reponseTest);
        expect(spyUpdate).toHaveBeenCalled();
    });

    it('updateApresEchange devrait appeler updateVue si il y a echange avec succes', () => {
        socketService.socket.id = 'idTest';
        const reponseTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'passer',
            argument: '',
            resultat: '',
            succes: true,
            messageErreur: '',
            score: 0,
        };

        const spyUpdate = spyOn(service, <any>['updateVue']).and.callFake(() => {
            return;
        });
        service['updateApresEchange'](reponseTest);
        expect(spyUpdate).not.toHaveBeenCalled();
    });

    it('updateApresEchange devrait appeler updateVue si il y a echange avec succes', () => {
        socketService.socket.id = 'idTest';
        const reponseTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'placer',
            argument: 'abc',
            resultat: JSON.stringify({}),
            succes: true,
            messageErreur: '',
            score: 0,
        };

        const chevalet = new Chevalet();
        chevalet.ajouterLettre(new Lettre('e'));
        chevalet.ajouterLettre(new Lettre('y'));
        chevalet.ajouterLettre(new Lettre('s'));
        chevalet.ajouterLettre(new Lettre('t'));
        chevalet.ajouterLettre(new Lettre('u'));
        chevalet.ajouterLettre(new Lettre('v'));
        chevalet.ajouterLettre(new Lettre('a'));

        const reponse = JSON.parse(reponseTest.resultat);
        reponse.chevalet = chevalet;
        reponseTest.resultat = JSON.stringify(reponse);
        const spyUpdate = spyOn(service, <any>['updateVue']).and.callFake(() => {
            return;
        });
        service['updateApresEchange'](reponseTest);
        expect(spyUpdate).toHaveBeenCalled();
    });

    it('updateApresEchange ne devrait rien faire si echec', () => {
        socketService.socket.id = 'idTest';
        const reponseTest = {
            idJoueur: 'idTest',
            nomJoueur: 'nomTest',
            type: 'placer',
            argument: 'abc',
            resultat: JSON.stringify({}),
            succes: false,
            messageErreur: '',
            score: 0,
        };
        const spyUpdate = spyOn(service, <any>['updateVue']).and.callFake(() => {
            return;
        });
        service['updateApresEchange'](reponseTest);
        expect(spyUpdate).not.toHaveBeenCalled();
        reponseTest.type = 'echanger';
        service['updateApresEchange'](reponseTest);
        expect(spyUpdate).not.toHaveBeenCalled();
    });

    it('echangerLettres devrait appeller envoyerCommande du gestionnaire de commande', () => {
        const gestionnaireCommande = TestBed.inject(GestionnaireDeCommandeService);
        const spyEnvoyerCommande = spyOn(gestionnaireCommande, 'envoyerCommande');
        service.echangerLettres();
        expect(spyEnvoyerCommande).toHaveBeenCalled();
        expect(service.selectEchange).toEqual([]);
    });

    it('echangerLettres devrait envoyer un message valide', () => {
        const gestionnaireCommande = TestBed.inject(GestionnaireDeCommandeService);
        const spyEnvoyerCommande = spyOn(gestionnaireCommande, 'envoyerCommande');
        service.chevalet = new Chevalet();
        service.chevalet.ajouterLettre(new Lettre('e'));
        service.chevalet.ajouterLettre(new Lettre('y'));
        service.chevalet.ajouterLettre(new Lettre('s'));
        service.chevalet.ajouterLettre(new Lettre('t'));
        service.chevalet.ajouterLettre(new Lettre('u'));
        service.chevalet.ajouterLettre(new Lettre('v'));
        service.chevalet.ajouterLettre(new Lettre('a'));
        service.selectEchange = [0, 1, 4];
        service.echangerLettres();
        expect(spyEnvoyerCommande).toHaveBeenCalledWith('!echanger eyu');
        expect(service.selectEchange).toEqual([]);
    });
});
