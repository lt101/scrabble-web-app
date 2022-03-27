import { Injectable } from '@angular/core';
import {
    CASES_BONUS,
    DECALAGE_BONUS_Y,
    DECALAGE_LETTRE,
    DECALAGE_MOT,
    DECALAGE_Y_MULTIPLICATEUR,
    HAUTEUR_DEFAUT,
    LARGEUR_DEFAUT,
    MILIEU_CASE,
    NB_CASES,
    POS_ETOILE,
} from '@app/constantes/play-area.constantes';
import { Coordonnee } from '@app/interfaces/coordonnee';
import { TaillePoliceService } from './taille-police.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private largeurCase;
    private hauteurCase;
    private taillePolice: number;
    private caseSelectionnee: Coordonnee;
    private canvasSize: Coordonnee;

    constructor(private tailleService: TaillePoliceService) {
        this.tailleService.police.subscribe((taillePolice) => {
            this.taillePolice = taillePolice;
            this.dessinerTableau();
        });
        this.largeurCase = LARGEUR_DEFAUT / NB_CASES;
        this.hauteurCase = HAUTEUR_DEFAUT / NB_CASES;
        this.canvasSize = { x: LARGEUR_DEFAUT, y: HAUTEUR_DEFAUT };
        this.caseSelectionnee = { x: 0, y: 0 };
    }

    dessinerTableau() {
        this.gridContext.clearRect(0, 0, this.width, this.height);
        this.dessinerCaseBonus();
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;

        for (let x = 0; x <= NB_CASES; x++) {
            this.dessinerLignesCase(this.width, this.height, x);
        }

        this.gridContext.stroke();
    }

    selectionnerCase(x: number, y: number, estHorizontal: boolean): void {
        this.caseSelectionnee = { x, y };
        this.dessinerTableau();
        this.illuminerCaseSel();
        this.dessinerFleche(estHorizontal);
    }

    private dessinerCaseBonus() {
        this.gridContext.save();
        let multiplicateur: string;
        let bonus: string;
        let decalageX: number;

        for (let i = 0; i < CASES_BONUS.cases.length; i++) {
            this.gridContext.lineWidth = 1;
            multiplicateur = i % 2 === 0 ? 'X2' : 'X3';
            bonus = i < 2 ? 'MOT' : 'LETTRE';
            decalageX = i < 2 ? DECALAGE_MOT : DECALAGE_LETTRE;
            this.gridContext.fillStyle = CASES_BONUS.couleurs[i];
            for (const pos of CASES_BONUS.cases[i]) {
                this.gridContext.fillRect(pos.x * this.largeurCase, pos.y * this.hauteurCase, this.largeurCase, this.hauteurCase);
                if (pos.x === POS_ETOILE && pos.y === POS_ETOILE) {
                    this.dessinerEtoile();
                    continue;
                }
                this.ecrireMot(bonus, (pos.x + decalageX) * this.largeurCase, (pos.y + DECALAGE_BONUS_Y) * this.hauteurCase);
                this.ecrireMot(multiplicateur, (pos.x + MILIEU_CASE) * this.largeurCase, (pos.y + DECALAGE_Y_MULTIPLICATEUR) * this.hauteurCase);
            }
        }
        this.gridContext.restore();
    }

    private dessinerEtoile() {
        this.gridContext.save();
        this.gridContext.textAlign = 'center';
        this.gridContext.font = '72px Arial';
        this.gridContext.fillStyle = 'gray';
        this.gridContext.fillText('\u2605', (POS_ETOILE + MILIEU_CASE) * this.largeurCase, (POS_ETOILE + 1) * this.hauteurCase);
        this.gridContext.restore();
    }

    private dessinerFleche(estHorizontal: boolean) {
        this.gridContext.save();
        const caractere = estHorizontal ? '\u21e8' : '\u21e9';
        this.gridContext.textAlign = 'center';
        this.gridContext.font = '72px Arial';
        this.gridContext.fillStyle = 'rgb(129, 233, 236)';
        this.gridContext.fillText(
            caractere,
            (this.caseSelectionnee.x + MILIEU_CASE) * this.largeurCase,
            (this.caseSelectionnee.y + 1) * this.hauteurCase,
        );
        this.gridContext.restore();
    }

    private ecrireMot(word: string, x: number, y: number) {
        if (word === '') return;
        this.gridContext.save();
        const startPosition: Coordonnee = { x, y };
        this.gridContext.font = `${this.taillePolice}px Arial`;
        this.gridContext.fillStyle = 'black';
        this.gridContext.textAlign = 'center';
        this.gridContext.fillText(word, startPosition.x, startPosition.y);
        this.gridContext.restore();
    }

    private illuminerCaseSel(): void {
        this.gridContext.save();
        this.gridContext.fillStyle = '#8c8c8c';
        this.gridContext.globalAlpha = 0.5;
        this.gridContext.fillRect(
            this.caseSelectionnee.x * this.largeurCase,
            this.caseSelectionnee.y * this.hauteurCase,
            this.largeurCase,
            this.hauteurCase,
        );
        this.gridContext.stroke();
        this.gridContext.restore();
    }

    private get width(): number {
        return this.canvasSize.x;
    }

    private get height(): number {
        return this.canvasSize.y;
    }

    private dessinerLignesCase(width: number, height: number, x: number): void {
        this.gridContext.moveTo((width * x) / NB_CASES, 0);
        this.gridContext.lineTo((width * x) / NB_CASES, height);
        this.gridContext.moveTo(0, (height * x) / NB_CASES);
        this.gridContext.lineTo(width, (height * x) / NB_CASES);
    }
}
