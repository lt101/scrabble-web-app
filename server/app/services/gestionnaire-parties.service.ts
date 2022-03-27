import { Partie } from '@app/classes/partie';
import { Commande } from '@app/interfaces/commande';
import { ConfigPartie } from '@app/interfaces/config-partie';
import { ReponseCommande } from '@app/interfaces/reponse-commande';
import { Service } from 'typedi';

@Service()
export class GestionnairePartiesService {
    parties: Map<string, Partie>;

    constructor() {
        this.parties = new Map<string, Partie>();
    }

    creerPartie(idPartie: string, config: ConfigPartie): Partie {
        const nouvellePartie = new Partie(config, idPartie);
        this.parties.set(idPartie, nouvellePartie);
        return nouvellePartie;
    }

    acheminerCommande(commande: Commande): ReponseCommande | void {
        return this.parties.get(commande.idPartie)?.traiterCommande(commande);
    }
}
