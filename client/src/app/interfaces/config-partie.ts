import { Joueur } from '@app/classes/joueur';

export interface ConfigPartie {
    mode: string;
    joueurs: Joueur[];
    option: string;
    minuterie: number;
}
