import { Lettre } from './lettre';

export const MAX_LETTRES_CHEVALET = 7;

export class Chevalet {
    lettres: Lettre[];

    constructor() {
        this.lettres = [];
    }

    ajouterLettre(lettreAAjouter: string): boolean {
        const estPossible = this.lettres.length + lettreAAjouter.length <= MAX_LETTRES_CHEVALET && lettreAAjouter !== '';
        if (estPossible) {
            for (const lettre of lettreAAjouter) {
                this.lettres.push(new Lettre(lettre));
            }
        }
        return estPossible;
    }

    retirerLettre(lettreARetirer: string): boolean {
        const estPossible = this.lettres.length > 0 && this.contientLettre(lettreARetirer);
        if (estPossible) {
            const index = this.lettres.findIndex((lettre) => lettre.lettre === lettreARetirer);
            this.lettres.splice(index, 1);
        }
        return estPossible;
    }

    contientLettre(lettreRecherche: string): boolean {
        for (const lettre of this.lettres) {
            if (lettre.lettre === lettreRecherche) return true;
        }
        return false;
    }

    nombreDeLettres(): number {
        return this.lettres.length;
    }
}
