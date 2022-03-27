import { RESERVEINITIALE } from '@app/constantes/reserve-initial';
export const MIN_LETTRES_ECHANGE_RESERVE = 7;
export const MAX_N_PIGE = 7;
const NB_LETTRES_ALPHABET = 27;
export const NOMBRE_LETTRES_INITIALES = 102;
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz*';

export class Reserve {
    reserveLettres: string[];
    private qteLettres: Map<string, number>;

    constructor() {
        this.reserveLettres = [];
        this.initialisationReserve();
        this.qteLettres = new Map<string, number>();
        RESERVEINITIALE.forEach((value, key) => {
            this.qteLettres.set(key, value);
        });
    }

    assezDeLettres(): boolean {
        return this.reserveLettres.length > MIN_LETTRES_ECHANGE_RESERVE;
    }

    piger(nLettres: number): string {
        let index: number;
        let lettre: string;
        let pige = '';
        if (this.reserveLettres.length < nLettres || nLettres > MAX_N_PIGE) return pige;
        for (let _ = 0; _ < nLettres; _++) {
            index = this.indexAleatoire();
            lettre = this.reserveLettres[index];
            this.actualiserQteLettres(lettre, '-');
            pige = pige + lettre;
            this.reserveLettres.splice(index, 1);
        }
        return pige;
    }

    remettre(lettreARemettres: string): boolean {
        if (!(this.reserveLettres.length < NOMBRE_LETTRES_INITIALES)) return false;
        for (const lettre of lettreARemettres) {
            this.reserveLettres.push(lettre);
            this.actualiserQteLettres(lettre, '+');
        }
        return true;
    }

    getReserveString(): string {
        let stringReserve = '';
        this.qteLettres.forEach((value, key) => {
            stringReserve += key + ' : ' + value + '\n';
        });
        return stringReserve;
    }
    private initialisationReserve(): void {
        for (let i = 0; i < NB_LETTRES_ALPHABET; i++) {
            const lettre = ALPHABET.charAt(i);
            const qteLettre = RESERVEINITIALE.get(lettre);
            if (lettre !== undefined && qteLettre !== undefined) {
                for (let j = 0; j < qteLettre; j++) this.reserveLettres.push(lettre);
            }
        }
    }

    private indexAleatoire(): number {
        const indexLettre = Math.floor(Math.random() * (this.reserveLettres.length - 1));
        return indexLettre;
    }
    private actualiserQteLettres(lettre: string, operateur: string): boolean {
        let qte = this.qteLettres.get(lettre);
        if (!qte) return false;

        if (operateur === '+') qte++;
        else if (operateur === '-') qte--;
        else return false;

        this.qteLettres.set(lettre, qte);
        return true;
    }
}
