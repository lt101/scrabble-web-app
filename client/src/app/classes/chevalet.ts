import { Lettre } from './lettre';

export const MAXLETTRES = 7;
const LETTRE_ABSENTE = -1;

export class Chevalet {
    lettres: Lettre[];

    constructor() {
        this.lettres = new Array<Lettre>();
    }

    ajouterLettre(lettreAAjouter: Lettre): boolean {
        const estPossible = this.lettres.length < MAXLETTRES;
        if (estPossible) {
            this.lettres.push(lettreAAjouter);
        }
        return estPossible;
    }

    retirerLettre(lettreARetirer: Lettre): boolean {
        const estPossible = this.lettres.length > 0;
        if (estPossible) {
            const index = this.lettres.findIndex((lettre) => lettre.lettre === lettreARetirer.lettre);
            if (index === LETTRE_ABSENTE) return false;
            this.lettres.splice(index, 1);
        }
        return estPossible;
    }

    get taille(): number {
        return this.lettres.length;
    }
}
