import { MAX_LETTRES_CHEVALET } from '@app/classes/chevalet';
import { Joueur } from '@app/classes/joueur';
import { Reserve } from '@app/classes/reserve';
import { ReponseCommande } from '@app/interfaces/reponse-commande';
import { Service } from 'typedi';

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz*';

@Service()
export class EchangeLettreService {
    reserve: Reserve;
    joueur: Joueur;

    constructor(joueur: Joueur) {
        this.reserve = new Reserve();
        this.joueur = joueur;
    }

    echangerLettres(lettresAEchanger: string): ReponseCommande {
        const reponseCommande = {
            idJoueur: this.joueur.id,
            nomJoueur: this.joueur.nom,
            type: 'echanger',
            argument: lettresAEchanger,
            resultat: '',
            succes: false,
            messageErreur: '',
            score: 0,
        };
        let lettresPigees = '';
        if (this.echangeEstPossible(lettresAEchanger)) {
            lettresPigees = this.reserve.piger(lettresAEchanger.length);
            this.reserve.remettre(lettresAEchanger);
            for (let i = 0; i < lettresAEchanger.length; i++) {
                this.joueur.chevalet.retirerLettre(lettresAEchanger[i]);
                this.joueur.chevalet.ajouterLettre(lettresPigees[i]);
            }
            reponseCommande.resultat = lettresPigees + ' ' + JSON.stringify(this.joueur.chevalet);
            reponseCommande.succes = true;
        } else reponseCommande.messageErreur = 'La commande est impossible à réaliser. Vérifier votre chevalet et la réserve.';
        return reponseCommande;
    }

    getQteReserve(): string {
        return this.reserve.getReserveString();
    }

    private echangeEstPossible(lettres: string): boolean {
        return this.reserve.assezDeLettres() && this.chevaletEstValide(lettres);
    }

    private chevaletEstValide(listeLettres: string): boolean {
        if (listeLettres.length <= MAX_LETTRES_CHEVALET) {
            for (const lettre of listeLettres) {
                if (!this.joueur.chevalet.contientLettre(lettre)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}
