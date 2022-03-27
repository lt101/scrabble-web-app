import { valeurs } from '@app/constantes/valeurs';

export class Lettre {
    lettre: string;
    valeur: number;

    constructor(lettreEntree: string) {
        this.lettre = lettreEntree;
        this.valeur = 0;
        if (valeurs.has(this.lettre)) {
            this.valeur = valeurs.get(this.lettre) as number;
        }
    }
}
