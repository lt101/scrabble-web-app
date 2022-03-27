/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { Chevalet } from '@app/classes/chevalet';
import { Joueur } from '@app/classes/joueur';
import { Lettre } from '@app/classes/lettre';
import { PAS_SELECT } from '@app/constantes/chevalet.service.constantes';
import { ChevaletService } from './chevalet.service';
import { GestionnaireDeCommandeService } from './gestionnaire-de-commande.service';
import { GestionnaireDeSocketService } from './gestionnaire-de-socket.service';
import { GridService } from './grid.service';
import { PlacementLettresService } from './placement-lettres.service';
import { PlacementManuelService } from './placement-manuel.service';

describe('PlacementManuelService', () => {
    let service: PlacementManuelService;
    let gridService: GridService;
    let placementService: PlacementLettresService;
    let socketManager: GestionnaireDeSocketService;
    let commandeService: GestionnaireDeCommandeService;
    let chevaletService: ChevaletService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlacementManuelService);
        gridService = TestBed.inject(GridService);
        placementService = TestBed.inject(PlacementLettresService);
        socketManager = TestBed.inject(GestionnaireDeSocketService);
        commandeService = TestBed.inject(GestionnaireDeCommandeService);
        chevaletService = TestBed.inject(ChevaletService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("reinitialiserPlacement devrait reinitialiser les attributs et remettre à leur état initial le chevalet et l'état du tableau", () => {
        service['caseCourante'] = { x: 6, y: 7 };
        const spyRetirer = spyOn(service, 'retirerLettre').and.callFake(() => {
            service['lettresPlacees'].pop();
        });
        const spyDessiner = spyOn(gridService, 'dessinerTableau').and.callFake(() => {
            return;
        });
        service['lettresPlacees'] = [
            { lettre: 'a', coor: { x: 2, y: 7 } },
            { lettre: 'v', coor: { x: 3, y: 7 } },
            { lettre: 'i', coor: { x: 4, y: 7 } },
            { lettre: 'o', coor: { x: 5, y: 7 } },
            { lettre: 'n', coor: { x: 6, y: 7 } },
        ];
        service.reinitialiserPlacement();
        expect(spyRetirer).toHaveBeenCalledTimes(5);
        expect(spyDessiner).toHaveBeenCalled();
        expect(service['placementCommencer']).toEqual(false);
        expect(service['caseCourante'].x).toEqual(PAS_SELECT);
        expect(service['orientation']).toEqual('h');
        expect(service['placementPossible']).toEqual(true);
    });

    it('selectionnerCase devrait appeler selectionnerCase de gridService', () => {
        const spySelect = spyOn(gridService, 'selectionnerCase').and.callFake(() => {
            return;
        });
        const partie = { joueurs: [], idPartie: '5678', joueurActif: new Joueur('blabla', '1234'), reserve: [] };
        socketManager.partie = partie;
        socketManager.socket.id = '1234';
        service['placementCommencer'] = false;
        service.selectionnerCase(4, 4);
        expect(spySelect).toHaveBeenCalled();
        expect(service['orientation']).toEqual('h');
        expect(service['caseCourante'].x).toEqual(4);
    });

    it("selectionnerCase change l'orientation si on appui sur la même case", () => {
        const spySelect = spyOn(gridService, 'selectionnerCase').and.callFake(() => {
            return;
        });
        const partie = { joueurs: [], idPartie: '5678', joueurActif: new Joueur('blabla', '1234'), reserve: [] };
        socketManager.partie = partie;
        socketManager.socket.id = '1234';
        service['placementCommencer'] = false;
        service.selectionnerCase(4, 4);
        service.selectionnerCase(4, 4);
        expect(spySelect).toHaveBeenCalledTimes(2);
        expect(service['orientation']).toEqual('v');
        expect(service['caseCourante'].x).toEqual(4);
        service.selectionnerCase(4, 4);
        expect(service['orientation']).toEqual('h');
    });

    it('selectionnerCase ne fait rien si placementCommencer est true', () => {
        const spySelect = spyOn(gridService, 'selectionnerCase').and.callFake(() => {
            return;
        });
        const partie = { joueurs: [], idPartie: '5678', joueurActif: new Joueur('blabla', '1234'), reserve: [] };
        socketManager.partie = partie;
        socketManager.socket.id = '1234';
        service['placementCommencer'] = true;
        service.selectionnerCase(4, 4);
        expect(spySelect).not.toHaveBeenCalled();
        expect(service['orientation']).toEqual('h');
        expect(service['caseCourante'].x).toEqual(PAS_SELECT);
    });

    it("selectionnerCase ne fait rien si ce n'est pas le tour du joueur", () => {
        const spySelect = spyOn(gridService, 'selectionnerCase').and.callFake(() => {
            return;
        });
        const partie = { joueurs: [], idPartie: '5678', joueurActif: new Joueur('blabla', '5678'), reserve: [] };
        socketManager.partie = partie;
        socketManager.socket.id = '1234';
        service['placementCommencer'] = false;
        service.selectionnerCase(4, 4);
        expect(spySelect).not.toHaveBeenCalled();
        expect(service['orientation']).toEqual('h');
        expect(service['caseCourante'].x).toEqual(PAS_SELECT);
    });

    it('placerLettre devrait appeler placerLettres de placementService', () => {
        service['caseCourante'] = { x: 5, y: 7 };
        service['placementPossible'] = true;
        chevaletService.chevalet = new Chevalet();
        chevaletService.chevalet.ajouterLettre(new Lettre('e'));
        const spyChevalet = spyOn(chevaletService, 'retirerLettres');
        const spyPlacement = spyOn(placementService, 'placerLettre');
        const spySelectNext = spyOn(service, <any>['selectionnerProchaineCase']);
        service.placerLettre('é');
        expect(spyChevalet).toHaveBeenCalled();
        expect(spyPlacement).toHaveBeenCalled();
        expect(spySelectNext).toHaveBeenCalled();
        expect(service['lettresPlacees'].length).toEqual(1);
    });

    it('placerLettre reconnait les lettres majuscules comme une lettre blanche', () => {
        service['caseCourante'] = { x: 5, y: 7 };
        service['placementPossible'] = true;
        chevaletService.chevalet = new Chevalet();
        chevaletService.chevalet.ajouterLettre(new Lettre('*'));
        const spyChevalet = spyOn(chevaletService, 'retirerLettres');
        const spyPlacement = spyOn(placementService, 'placerLettre');
        const spySelectNext = spyOn(service, <any>['selectionnerProchaineCase']);
        service.placerLettre('A');
        expect(spyChevalet).toHaveBeenCalled();
        expect(spyPlacement).toHaveBeenCalled();
        expect(spySelectNext).toHaveBeenCalled();
        expect(service['lettresPlacees'].length).toEqual(1);
    });

    it("placerLettre ne devrait rien faire si la caseCourante n'est pas valide", () => {
        service['caseCourante'] = { x: 15, y: 7 };
        service['placementPossible'] = true;
        chevaletService.chevalet = new Chevalet();
        chevaletService.chevalet.ajouterLettre(new Lettre('e'));
        const spyChevalet = spyOn(chevaletService, 'retirerLettres');
        const spyPlacement = spyOn(placementService, 'placerLettre');
        const spySelectNext = spyOn(service, <any>['selectionnerProchaineCase']);
        service.placerLettre('é');
        expect(spyChevalet).not.toHaveBeenCalled();
        expect(spyPlacement).not.toHaveBeenCalled();
        expect(spySelectNext).not.toHaveBeenCalled();
        expect(service['lettresPlacees'].length).toEqual(0);
    });

    it('placerLettre ne devrait rien faire si placementPossible est false', () => {
        service['caseCourante'] = { x: 12, y: 7 };
        service['placementPossible'] = false;
        chevaletService.chevalet = new Chevalet();
        chevaletService.chevalet.ajouterLettre(new Lettre('e'));
        const spyChevalet = spyOn(chevaletService, 'retirerLettres');
        const spyPlacement = spyOn(placementService, 'placerLettre');
        const spySelectNext = spyOn(service, <any>['selectionnerProchaineCase']);
        service.placerLettre('é');
        expect(spyChevalet).not.toHaveBeenCalled();
        expect(spyPlacement).not.toHaveBeenCalled();
        expect(spySelectNext).not.toHaveBeenCalled();
        expect(service['lettresPlacees'].length).toEqual(0);
    });

    it('placerLettre ne devrait rien faire si le chevalet ne contient pas la lettre', () => {
        service['caseCourante'] = { x: 12, y: 7 };
        service['placementPossible'] = true;
        chevaletService.chevalet = new Chevalet();
        chevaletService.chevalet.ajouterLettre(new Lettre('a'));
        const spyChevalet = spyOn(chevaletService, 'retirerLettres');
        const spyPlacement = spyOn(placementService, 'placerLettre');
        const spySelectNext = spyOn(service, <any>['selectionnerProchaineCase']);
        service.placerLettre('é');
        expect(spyChevalet).not.toHaveBeenCalled();
        expect(spyPlacement).not.toHaveBeenCalled();
        expect(spySelectNext).not.toHaveBeenCalled();
        expect(service['lettresPlacees'].length).toEqual(0);
    });

    it('retirerLettre devrait appeler retirerLettres et ajouterLettres', () => {
        service['caseCourante'] = { x: 5, y: 7 };
        service['placementPossible'] = true;
        service['placementCommencer'] = true;
        service['lettresPlacees'] = [{ lettre: 'a', coor: { x: 5, y: 7 } }];
        chevaletService.chevalet = new Chevalet();
        const spyChevalet = spyOn(chevaletService, 'ajouterLettres');
        const spyPlacement = spyOn(placementService, 'retirerLettre');
        const spyClearRect = spyOn(gridService, 'selectionnerCase').and.callFake(() => {
            return;
        });
        service.retirerLettre();
        expect(spyChevalet).toHaveBeenCalled();
        expect(spyPlacement).toHaveBeenCalled();
        expect(spyClearRect).toHaveBeenCalled();
    });

    it('retirerLettre devrait appeler retirerLettres et ajouterLettres', () => {
        service['caseCourante'] = { x: 5, y: 7 };
        service['placementPossible'] = true;
        service['placementCommencer'] = true;
        service['lettresPlacees'] = [
            { lettre: 'A', coor: { x: 5, y: 7 } },
            { lettre: 'B', coor: { x: 6, y: 7 } },
        ];
        chevaletService.chevalet = new Chevalet();
        const spyChevalet = spyOn(chevaletService, 'ajouterLettres');
        const spyPlacement = spyOn(placementService, 'retirerLettre');
        const spyClearRect = spyOn(gridService, 'selectionnerCase').and.callFake(() => {
            return;
        });
        service.retirerLettre();
        expect(spyChevalet).toHaveBeenCalled();
        expect(spyPlacement).toHaveBeenCalled();
        expect(spyClearRect).toHaveBeenCalled();
    });

    it('retirerLettre ne devrait rien appeler dans les mauvaises conditions', () => {
        service['caseCourante'] = { x: 5, y: 7 };
        service['placementPossible'] = true;
        service['placementCommencer'] = false;
        service['lettresPlacees'] = [{ lettre: 'a', coor: { x: 5, y: 7 } }];
        chevaletService.chevalet = new Chevalet();
        const spyChevalet = spyOn(chevaletService, 'ajouterLettres');
        const spyPlacement = spyOn(placementService, 'retirerLettre');
        service.retirerLettre();
        expect(spyChevalet).not.toHaveBeenCalled();
        expect(spyPlacement).not.toHaveBeenCalled();
        service['placementCommencer'] = true;
        service['lettresPlacees'] = [];
        service.retirerLettre();
        expect(spyChevalet).not.toHaveBeenCalled();
        expect(spyPlacement).not.toHaveBeenCalled();
    });

    it('envoyerCommande devrait appeller le service de commandes', () => {
        const partie = { joueurs: [], idPartie: '5678', joueurActif: new Joueur('blabla', '1234'), reserve: [] };
        socketManager.partie = partie;
        socketManager.socket.id = '1234';
        service['lettresPlacees'] = [{ lettre: 'a', coor: { x: 5, y: 7 } }];
        service['orientation'] = 'h';
        const spyCommande = spyOn(commandeService, 'envoyerCommande');
        const spyReinitialiser = spyOn(service, 'reinitialiserPlacement').and.callFake(() => {
            return;
        });
        service.envoyerCommande();
        expect(spyCommande).toHaveBeenCalled();
        expect(spyReinitialiser).toHaveBeenCalled();
    });

    it("envoyerCommande ne devrait pas appeller le service de commandes si ce n'est pas mon tour", () => {
        const partie = { joueurs: [], idPartie: '5678', joueurActif: new Joueur('blabla', '5678'), reserve: [] };
        socketManager.partie = partie;
        socketManager.socket.id = '1234';
        service['lettresPlacees'] = [{ lettre: 'a', coor: { x: 5, y: 7 } }];
        service['orientation'] = 'h';
        const spyCommande = spyOn(commandeService, 'envoyerCommande');
        const spyReinitialiser = spyOn(service, 'reinitialiserPlacement').and.callFake(() => {
            return;
        });
        service.envoyerCommande();
        expect(spyCommande).not.toHaveBeenCalled();
        expect(spyReinitialiser).not.toHaveBeenCalled();
    });

    it("envoyerCommande ne devrait pas appeller le service de commandes si ce n'est pas mon tour", () => {
        const partie = { joueurs: [], idPartie: '5678', joueurActif: new Joueur('blabla', '1234'), reserve: [] };
        socketManager.partie = partie;
        socketManager.socket.id = '1234';
        service['lettresPlacees'] = [];
        service['orientation'] = 'h';
        const spyCommande = spyOn(commandeService, 'envoyerCommande');
        const spyReinitialiser = spyOn(service, 'reinitialiserPlacement').and.callFake(() => {
            return;
        });
        service.envoyerCommande();
        expect(spyCommande).not.toHaveBeenCalled();
        expect(spyReinitialiser).not.toHaveBeenCalled();
    });

    it('selectionnerProchaineCase devrait select la prochaine case', () => {
        service['caseCourante'] = { x: 6, y: 7 };
        service['orientation'] = 'v';
        placementService['tableau'].placerLettres([new Lettre('a')], [service['caseCourante']]);
        const spySelectCase = spyOn(gridService, 'selectionnerCase').and.callFake(() => {
            return;
        });
        service['selectionnerProchaineCase']();
        expect(spySelectCase).toHaveBeenCalled();
        expect(service['caseCourante'].y).toEqual(8);
    });

    it('selectionnerProchaineCase ne devrait pas select la prochaine case si on sort du tableau', () => {
        service['caseCourante'] = { x: 14, y: 7 };
        service['orientation'] = 'h';
        placementService['tableau'].placerLettres([new Lettre('a')], [service['caseCourante']]);
        const spyDessiner = spyOn(gridService, 'dessinerTableau').and.callFake(() => {
            return;
        });
        service['selectionnerProchaineCase']();
        expect(spyDessiner).toHaveBeenCalled();
        expect(service['caseCourante'].x).toEqual(15);
        expect(service['placementPossible']).toBeFalse();
    });
});
