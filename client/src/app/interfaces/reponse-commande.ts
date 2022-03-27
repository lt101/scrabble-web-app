export interface ReponseCommande {
    idJoueur: string;
    nomJoueur: string;
    type: string;
    argument: string;
    resultat: string;
    succes: boolean;
    messageErreur: string;
    score: number;
}
