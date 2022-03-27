import { ElementRef, Injectable, QueryList } from '@angular/core';
import { Lettre } from '@app/classes/lettre';
import { Tableau } from '@app/classes/tableau';
import { NB_CASES } from '@app/constantes/play-area.constantes';
import { Coordonnee } from '@app/interfaces/coordonnee';
import { Subject } from 'rxjs';
import { TaillePoliceService } from './taille-police.service';

const INCREMENT_POLICE = 5;

@Injectable({
    providedIn: 'root',
})
export class PlacementLettresService {
    tuilesHTML: QueryList<ElementRef>;
    private sujetTableau: Subject<Tableau>;
    private taillePolice: number;
    private placementTemp: { lettre: string; coor: Coordonnee }[];
    private tableau: Tableau;

    constructor(private tailleService: TaillePoliceService) {
        this.tableau = new Tableau();
        this.placementTemp = [];
        this.sujetTableau = new Subject<Tableau>();
        this.tailleService.police.subscribe((taille) => {
            this.taillePolice = taille;
        });
        this.sujetTableau.next(this.tableau);
    }

    placerLettre(lettres: Lettre[], coors: Coordonnee[]) {
        this.tableau.placerLettres(lettres, coors);
        this.actualiserVue();
    }

    retirerLettre(coors: Coordonnee[]) {
        this.tableau.retirerLettres(coors);
        this.actualiserVue();
    }

    actualiserVue() {
        let indexColonne = 0;
        let tuile: ElementRef | undefined;
        for (const colonne of this.tableau.lettresPlacees) {
            let indexRangee = 0;
            for (const lettre of colonne) {
                tuile = this.tuilesHTML.find((element) => element.nativeElement.id === `IdC${indexColonne}R${indexRangee}`);
                if (lettre) {
                    this.afficherTuile(tuile?.nativeElement, lettre, this.aContourColore({ x: indexColonne, y: indexRangee }));
                } else {
                    this.cacherTuile(tuile?.nativeElement);
                }
                indexRangee++;
            }
            indexColonne++;
        }
    }

    placerTuiles() {
        for (let colonne = 0; colonne < NB_CASES; colonne++) {
            for (let rangee = 0; rangee < NB_CASES; rangee++) {
                const tuile = this.tuilesHTML.find((element) => element.nativeElement.id === `IdC${colonne}R${rangee}`);
                if (!tuile) continue;
                tuile.nativeElement.style.gridRow = `${rangee + 2}/${rangee + 3}`;
                tuile.nativeElement.style.gridColumn = `${colonne + 2}/${colonne + 3}`;
            }
        }
    }
    caseEstRemplie(coordonnee: Coordonnee): boolean {
        return this.tableau.lettresPlacees[coordonnee.x][coordonnee.y] !== undefined;
    }

    updatePlacementTemp(lettrePlacees: { lettre: string; coor: Coordonnee }[]) {
        this.placementTemp = lettrePlacees;
    }

    private afficherTuile(htmlElement: HTMLElement | null, lettrePlacee: Lettre, aContour: boolean): boolean {
        if (!htmlElement) return false;
        htmlElement.style.border = aContour ? '2pt solid rgb(129, 233, 236)' : '1pt solid rgba(165, 137, 101, 0.863)';
        htmlElement.style.zIndex = '6';
        htmlElement.style.visibility = 'visible';
        const lettre = htmlElement.children.item(0) as HTMLElement;
        lettre.style.fontSize = `${this.taillePolice + INCREMENT_POLICE}px`;
        lettre.innerHTML = lettrePlacee.lettre.toUpperCase();
        const points = htmlElement.childNodes.item(1) as HTMLElement;
        points.style.fontSize = `${this.taillePolice - 1}px`;
        points.innerHTML = lettrePlacee.valeur.toString();
        return true;
    }

    private cacherTuile(htmlElement: HTMLElement | null): boolean {
        if (!htmlElement) return false;
        htmlElement.style.zIndex = '1';
        htmlElement.style.visibility = 'hidden';
        const lettre = htmlElement.children.item(0) as HTMLElement;
        lettre.innerHTML = '';
        const points = htmlElement.children.item(1) as HTMLElement;
        points.innerHTML = '';
        return true;
    }

    private aContourColore(coor: Coordonnee): boolean {
        let aContour = false;
        if (this.placementTemp.length !== 0) {
            this.placementTemp.forEach((value) => {
                if (value.coor.x === coor.x && value.coor.y === coor.y) aContour = true;
            });
        }
        return aContour;
    }
}
