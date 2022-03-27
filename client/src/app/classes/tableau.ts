import { NB_CASES } from '@app/constantes/play-area.constantes';
import { Coordonnee } from '@app/interfaces/coordonnee';
import { Lettre } from './lettre';

export class Tableau {
    lettresPlacees: Lettre[][];

    constructor() {
        this.lettresPlacees = new Array<Lettre[]>(NB_CASES);
        for (let i = 0; i < NB_CASES; i++) {
            this.lettresPlacees[i] = new Array<Lettre>(NB_CASES);
        }
    }

    placerLettres(lettres: Lettre[], cases: Coordonnee[]): boolean {
        if (lettres.length !== cases.length) return false;
        const nLettre = lettres.length;
        const casesModifiee = Array<Coordonnee>();
        for (let i = 0; i < nLettre; i++) {
            if (!this.coorHorsTableau(cases[i])) {
                this.lettresPlacees[cases[i].x][cases[i].y] = lettres[i];
                casesModifiee.push(cases[i]);
            } else {
                this.retirerLettres(casesModifiee);
                return false;
            }
        }
        return true;
    }

    retirerLettres(cases: Coordonnee[]): boolean {
        for (const pos of cases) {
            if (this.coorHorsTableau(pos)) return false;
        }
        for (const pos of cases) {
            delete this.lettresPlacees[pos.x][pos.y];
        }
        return true;
    }

    private coorHorsTableau(coor: Coordonnee): boolean {
        if (!(0 <= coor.x && coor.x < NB_CASES)) return true;
        if (!(0 <= coor.y && coor.y < NB_CASES)) return true;
        return false;
    }
}
