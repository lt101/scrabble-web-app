import { Joueur } from '@app/classes/joueur';

export interface InfoPartie {
    joueurs: Joueur[];
    idPartie: string;
    joueurActif: Joueur;
    reserve: string[];
}
