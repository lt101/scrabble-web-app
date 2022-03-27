import { MAX_LETTRES_CHEVALET } from '@app/classes/chevalet';
import { Joueur } from '@app/classes/joueur';
import { PROB_0_6_PTS, PROB_13_18_PTS, PROB_7_12_PTS, SCORE_12, SCORE_13, SCORE_18, SCORE_6, SCORE_7 } from '@app/constantes/partie.constantes';
import { Placement } from '@app/interfaces/placement';
import { Service } from 'typedi';
import { ALPHABET } from './echange-lettres.service';

@Service()
export class JoueurVirtuelService {
    echangeJV(jv: Joueur): string {
        const nLettres = Math.floor(Math.random() * (MAX_LETTRES_CHEVALET - 1)) + 1;
        const copieChevalet: string[] = [];
        jv.chevalet.lettres.forEach((lettreChevalet) => {
            copieChevalet.push(lettreChevalet.lettre);
        });
        let argument = '';
        let indexLettre: number;
        for (let _ = 0; _ < nLettres; _++) {
            indexLettre = Math.floor(Math.random() * (copieChevalet.length - 1));
            argument = argument + copieChevalet[indexLettre];
            copieChevalet.splice(indexLettre, 1);
        }
        return argument;
    }

    placementJV(possibilites: Placement[]): string {
        let argument = '';
        // const possibilites = this.commandeService.analysePlateauService.analyserAvecChevalet();

        if (possibilites.length !== 0) {
            let choix: Placement = { lettres: '', coordonnee: { x: 0, y: 0 }, estHorizontal: false, score: 0 };
            const PLAGE_0_6: Placement[] = [];
            const PLAGE_7_12: Placement[] = [];
            const PLAGE_13_18: Placement[] = [];

            possibilites.forEach((placement) => {
                if (0 <= placement.score && placement.score <= SCORE_6) PLAGE_0_6.push(placement);
                if (SCORE_7 <= placement.score && placement.score <= SCORE_12) PLAGE_7_12.push(placement);
                if (SCORE_13 <= placement.score && placement.score <= SCORE_18) PLAGE_13_18.push(placement);
            });

            const nbAleatoire = Math.random();
            if (0 <= nbAleatoire && nbAleatoire <= PROB_0_6_PTS && PLAGE_0_6.length > 0)
                choix = PLAGE_0_6[Math.floor(Math.random() * PLAGE_0_6.length)];
            if (PROB_0_6_PTS < nbAleatoire && nbAleatoire <= PROB_7_12_PTS && PLAGE_7_12.length > 0)
                choix = PLAGE_7_12[Math.floor(Math.random() * PLAGE_7_12.length)];
            if (PROB_7_12_PTS < nbAleatoire && nbAleatoire <= PROB_13_18_PTS && PLAGE_13_18.length > 0)
                choix = PLAGE_13_18[Math.floor(Math.random() * PLAGE_13_18.length)];

            if (choix.lettres === '') return argument;

            const lettres = choix.lettres;
            const coordY = ALPHABET.charAt(choix.coordonnee.y);
            const coordX = choix.coordonnee.x + 1;
            const direction = choix.estHorizontal ? 'h' : 'v';
            argument = `${coordY}${coordX}${direction} ${lettres}`;
        }
        return argument;
    }
}
