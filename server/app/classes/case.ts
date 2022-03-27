import { Lettre } from './lettre';

export class Case {
    bonusLettre: number;
    bonusMot: number;
    lettreContenue: Lettre;
    estRemplieCeTour: boolean;

    constructor() {
        this.bonusLettre = 1;
        this.bonusMot = 1;
        this.estRemplieCeTour = false;
        this.lettreContenue = new Lettre('');
    }
}
