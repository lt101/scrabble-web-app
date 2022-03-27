import { Case } from '@app/classes/case';
import { Mot } from '@app/classes/mot';
import { Service } from 'typedi';
import { ValidationMotService } from './validation-mot.service';

const MOT_INVALIDE = -1;

@Service()
export class CalculPointsService {
    private plateau: Case[][];

    private validateur: ValidationMotService;

    constructor() {
        this.validateur = new ValidationMotService();
        this.plateau = new Array<Case[]>();
    }

    // retourne -1 si il y a un mot invalide
    calculMots(motsPlaces: Mot[], plateau: Case[][]): { motsInvalides: string[]; score: number } {
        this.plateau = plateau;
        let compteur = 0;
        const motsInvalides = [];
        for (const mot of motsPlaces) {
            if (this.validateur.validation(mot)) {
                compteur += this.calculMotIndividuel(mot);
            } else {
                motsInvalides.push(mot.extraireString());
            }
        }
        if (motsInvalides.length > 0) {
            return { motsInvalides, score: MOT_INVALIDE };
        }
        return { motsInvalides: [], score: compteur };
    }

    private calculMotIndividuel(motEntre: Mot): number {
        let compteur = 0;
        let bonusMot = 1;
        let i = 0;
        let j = 0;
        for (const lettre of motEntre.mot) {
            const caseCourante = this.plateau[motEntre.x + i][motEntre.y + j];
            if (caseCourante.estRemplieCeTour) {
                compteur += lettre.valeur * caseCourante.bonusLettre;
                bonusMot *= caseCourante.bonusMot;
            } else {
                compteur += lettre.valeur;
            }
            if (motEntre.estHorizontal) {
                i++;
            } else {
                j++;
            }
        }
        return compteur * bonusMot;
    }
}
