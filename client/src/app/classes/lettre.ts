import { valeurs } from '@app/constantes/valeurs';

export class Lettre {
    lettre: string;
    valeur: number;

    constructor(lettreEntree: string) {
        this.lettre = lettreEntree;
        // lettre majuscules sont blanches
        if (this.lettre === this.lettre.toUpperCase()) {
            this.valeur = 0;
        } else {
            this.valeur = valeurs.get(this.lettre) as number;
        }
    }
}
