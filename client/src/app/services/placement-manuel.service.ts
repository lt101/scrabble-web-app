import { ElementRef, Injectable, QueryList } from '@angular/core';
import { Lettre } from '@app/classes/lettre';
import { PAS_SELECT } from '@app/constantes/chevalet.service.constantes';
import { NB_CASES } from '@app/constantes/play-area.constantes';
import { Coordonnee } from '@app/interfaces/coordonnee';
import { ChevaletService } from './chevalet.service';
import { GestionnaireDeCommandeService } from './gestionnaire-de-commande.service';
import { GestionnaireDeSocketService } from './gestionnaire-de-socket.service';
import { GridService } from './grid.service';
import { PlacementLettresService } from './placement-lettres.service';

@Injectable({
    providedIn: 'root',
})
export class PlacementManuelService {
    private orientation: string;
    private caseCourante: Coordonnee;
    private placementCommencer: boolean;
    private placementPossible: boolean;
    private lettresPlacees: { lettre: string; coor: Coordonnee }[];

    constructor(
        private gridService: GridService,
        private chevaletService: ChevaletService,
        private placementService: PlacementLettresService,
        private gestionnaireCommande: GestionnaireDeCommandeService,
        private socketService: GestionnaireDeSocketService,
    ) {
        this.lettresPlacees = [];
        this.placementCommencer = false;
        this.caseCourante = { x: PAS_SELECT, y: PAS_SELECT };
        this.orientation = 'h';
        this.placementPossible = true;
    }

    initialiserTableau(canvas: CanvasRenderingContext2D, tuiles: QueryList<ElementRef>) {
        // OK
        this.gridService.gridContext = canvas;
        this.placementService.tuilesHTML = tuiles;
        this.gridService.dessinerTableau();
        this.placementService.placerTuiles();
        this.placementService.actualiserVue();
        this.socketService.getPlacementLettres().subscribe((lettresAPlacer) => {
            this.placementService.placerLettre(lettresAPlacer.lettres, lettresAPlacer.coordonnees);
        });
    }

    selectionnerCase(posX: number, posY: number) {
        if (!this.estMonTour()) return;
        if (this.placementCommencer) return;

        if (this.caseCourante.x === posX && this.caseCourante.y === posY) {
            this.orientation = this.orientation === 'h' ? 'v' : 'h';
        } else {
            this.orientation = 'h';
        }
        const estHorizontal = this.orientation === 'h';
        this.caseCourante = { x: posX, y: posY };
        this.gridService.selectionnerCase(posX, posY, estHorizontal);
    }

    placerLettre(lettre: string) {
        if (!this.coorValide(this.caseCourante) || this.caseCourante.x === PAS_SELECT) return;
        if (!this.placementPossible) return;

        lettre = lettre.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        if (!this.chevaletService.contientLettre(lettre)) return;

        this.lettresPlacees.push({ lettre, coor: { ...this.caseCourante } });

        if (lettre.match(/[A-Z]/)) {
            this.chevaletService.retirerLettres('*');
        } else this.chevaletService.retirerLettres(lettre);

        this.placementService.updatePlacementTemp(this.lettresPlacees);
        this.placementService.placerLettre([new Lettre(lettre)], [this.caseCourante]);
        this.selectionnerProchaineCase();
        this.placementCommencer = true;
    }

    retirerLettre() {
        if (!this.placementCommencer) return;
        const aEffacer = this.lettresPlacees.pop();
        if (!aEffacer) return;

        const estHorizontal = this.orientation === 'h';
        const caseAEffacer = aEffacer.coor;

        if (aEffacer.lettre.match(/[A-Z]/)) {
            this.chevaletService.ajouterLettres('*');
        } else {
            this.chevaletService.ajouterLettres(aEffacer.lettre);
        }

        this.placementService.updatePlacementTemp(this.lettresPlacees);
        this.placementService.retirerLettre([caseAEffacer]);
        this.gridService.selectionnerCase(caseAEffacer.x, caseAEffacer.y, estHorizontal);
        this.caseCourante = caseAEffacer;
        if (this.lettresPlacees.length === 0) this.placementCommencer = false;
        this.placementPossible = true;
    }

    reinitialiserPlacement() {
        const len = this.lettresPlacees.length;
        for (let _ = 0; _ < len; _++) this.retirerLettre();
        this.placementCommencer = false; // OK
        this.caseCourante = { x: PAS_SELECT, y: PAS_SELECT };
        this.orientation = 'h';
        this.gridService.dessinerTableau();
        this.placementPossible = true;
    }

    envoyerCommande(): void {
        if (!this.estMonTour()) return;
        if (this.lettresPlacees.length === 0) return;
        let commande = '!placer ';
        commande += this.transformerCoordonnees() + this.orientation + ' ';
        for (const lettrePlacee of this.lettresPlacees) {
            commande += lettrePlacee.lettre;
        }
        this.gestionnaireCommande.envoyerCommande(commande);
        this.reinitialiserPlacement();
    }

    private coorValide(coor: Coordonnee) {
        const xEstValide = 0 <= coor.x && coor.x < NB_CASES;
        const yEstValide = 0 <= coor.y && coor.y < NB_CASES;
        return xEstValide && yEstValide;
    }

    private transformerCoordonnees(): string {
        let lettresPlacement = '';
        lettresPlacement += String.fromCharCode(this.lettresPlacees[0].coor.y + 'a'.charCodeAt(0));
        lettresPlacement += (this.lettresPlacees[0].coor.x + 1).toString();
        return lettresPlacement;
    }

    private selectionnerProchaineCase() {
        const estHorizontal = this.orientation === 'h';
        let prochaineCase = this.caseCourante;

        while (this.coorValide(prochaineCase) && this.placementService.caseEstRemplie(prochaineCase)) {
            prochaineCase = estHorizontal ? { x: prochaineCase.x + 1, y: prochaineCase.y } : { x: prochaineCase.x, y: prochaineCase.y + 1 };
        }

        if (this.coorValide(prochaineCase)) {
            this.gridService.selectionnerCase(prochaineCase.x, prochaineCase.y, estHorizontal);
        } else {
            this.placementPossible = false;
            this.gridService.dessinerTableau();
        }
        this.caseCourante = prochaineCase;
    }

    private estMonTour(): boolean {
        return this.socketService.partie.joueurActif.id === this.socketService.socket.id;
    }
}
