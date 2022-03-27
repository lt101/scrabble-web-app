import { Mot } from '@app/classes/mot';
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class ValidationMotService {
    dictionnaire: Set<string>;
    mot: string;

    constructor() {
        this.dictionnaire = new Set();
        for (const dico of JSON.parse(fs.readFileSync('./assets/dictionnary.json', 'utf8')).words) {
            this.dictionnaire.add(dico);
        }
        this.mot = '';
    }

    validation(motEntre: Mot): boolean {
        this.changerMot(motEntre);
        return this.tailleSupADeux() && !this.contientApostropheEtTrait() && this.appartientAuDictionnaire();
    }

    private tailleSupADeux(): boolean {
        return this.mot.length >= 2;
    }

    private changerMot(motEntre: Mot): void {
        this.mot = motEntre.extraireString();
    }

    private contientApostropheEtTrait(): boolean {
        for (const char of this.mot) {
            if (char === '-' || char === "'") {
                return true;
            }
        }
        return false;
    }
    private appartientAuDictionnaire(): boolean {
        return this.dictionnaire.has(this.mot.toLowerCase());
    }
}
