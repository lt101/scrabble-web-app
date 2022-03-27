import { Lettre } from './lettre';

export class Mot {
    mot: Lettre[];
    x: number;
    y: number;
    estHorizontal: boolean;

    constructor(motEntre: string, coordonnee?: { x: number; y: number }, estHorizontal?: boolean) {
        this.mot = [];
        motEntre = this.nettoyerMot(motEntre);
        for (let i = 0; i < motEntre.length; i++) {
            this.mot[i] = new Lettre(motEntre[i]);
        }
        if (typeof coordonnee !== 'undefined') {
            this.x = coordonnee.x;
            this.y = coordonnee.y;
            this.estHorizontal = estHorizontal as boolean;
        }
    }

    extraireString(): string {
        const characteres: string[] = [];
        for (let i = 0; i < this.mot.length; i++) {
            characteres[i] = this.mot[i].lettre;
        }
        return characteres.join('');
    }

    // Enleve accents, cedilles, et tremas
    private nettoyerMot(motEntre: string): string {
        return motEntre.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }
}
