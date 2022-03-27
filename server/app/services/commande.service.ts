import { Joueur } from '@app/classes/joueur';
import { MOT_INVALIDE } from '@app/constantes/placement-lettres.constantes';
import { Commande } from '@app/interfaces/commande';
import { ReponseCommande } from '@app/interfaces/reponse-commande';
import { Service } from 'typedi';
import { AnalysePlateauService } from './analyse-plateau.service';
import { ALPHABET, EchangeLettreService } from './echange-lettres.service';
import { PlacementLettresService } from './placement-lettres.service';

export const MAX_ECHANGE = 7;
@Service()
export class CommandeService {
    echangeLettreService: EchangeLettreService;
    analysePlateauService: AnalysePlateauService;
    private placerLettresService: PlacementLettresService;
    private joueur: Joueur;

    constructor(joueur: Joueur) {
        this.joueur = joueur;
        this.echangeLettreService = new EchangeLettreService(this.joueur);
        this.placerLettresService = new PlacementLettresService(this.joueur);
        this.analysePlateauService = new AnalysePlateauService(this.placerLettresService);
    }

    determinerCommande(commande: Commande): ReponseCommande {
        commande.argument = commande.argument.trim();
        let reponseCommande = {
            idJoueur: this.joueur.id,
            nomJoueur: this.joueur.nom,
            type: '',
            argument: '',
            resultat: '',
            succes: false,
            messageErreur: '',
            score: 0,
        };
        switch (commande.type) {
            case 'echanger': {
                reponseCommande = this.envoyerEchange(commande);
                break;
            }
            case 'placer': {
                reponseCommande = this.envoyerPlacement(commande);
                break;
            }
            case 'passer': {
                reponseCommande.type = 'passer';
                reponseCommande.succes = this.joueur.estMonTour;
                reponseCommande.messageErreur = '';
                break;
            }
            case 'reserve': {
                reponseCommande = this.envoyerReserve(commande);
                break;
            }
            case 'indice': {
                reponseCommande = this.envoyerIndice(commande);
                break;
            }
            default: {
                reponseCommande.messageErreur = "Cette commande n'existe pas!";
                break;
            }
        }
        return reponseCommande;
    }

    changerJoueur(joueur: Joueur): void {
        this.joueur = joueur;
        this.placerLettresService.joueur = joueur;
        this.echangeLettreService.joueur = joueur;
    }

    private envoyerReserve(commande: Commande): ReponseCommande {
        const reponseCommande = {
            idJoueur: this.joueur.id,
            nomJoueur: this.joueur.nom,
            type: 'reserve',
            argument: '',
            resultat: '',
            succes: false,
            messageErreur: '',
            score: 0,
        };

        if (commande.argument !== '')
            reponseCommande.messageErreur = "Pour voir l'état de la réserve, écrivez simplement ceci: !reserve. Veuilez réessayer:";
        else {
            reponseCommande.resultat = this.echangeLettreService.getQteReserve();
        }
        return reponseCommande;
    }

    private envoyerIndice(commande: Commande): ReponseCommande {
        const reponseCommande = {
            idJoueur: this.joueur.id,
            nomJoueur: this.joueur.nom,
            type: 'indice',
            argument: '',
            resultat: '',
            succes: false,
            messageErreur: '',
            score: 0,
        };

        if (commande.argument !== '')
            reponseCommande.messageErreur = 'Pour recevoir des indices, écrivez simplement ceci: !indice. Veuilez réessayer:';
        else {
            const analyse = this.analysePlateauService.analyserAvecChevalet();
            let analyseFiltree = [];
            if (analyse.length >= 3) {
                for (let _ = 0; _ < 3; _++) {
                    const indexAleatoire = Math.floor(Math.random() * analyse.length);
                    analyseFiltree.push(analyse[indexAleatoire]);
                    analyse.splice(indexAleatoire, 1);
                }
            } else {
                analyseFiltree = analyse;
            }
            const reponses = [];
            for (const placement of analyseFiltree) {
                reponses.push(this.convertirEnPlacement(placement.lettres, placement.coordonnee, placement.estHorizontal));
            }
            reponses.sort();
            switch (reponses.length) {
                case 0: {
                    reponseCommande.resultat += 'Aucun placement valide trouvé.';
                    break;
                }
                case 1: {
                    reponseCommande.resultat += 'Seulement un placement valide trouvé:\n';
                    break;
                }
                case 2: {
                    reponseCommande.resultat += 'Seulement deux placements valides trouvés:\n';
                    break;
                }
                case 3: {
                    reponseCommande.resultat += 'Voici quelques placements possibles pour vous aider :) :\n';
                    break;
                }
            }
            for (const reponse of reponses) {
                reponseCommande.resultat += reponse + '\n';
            }
        }
        return reponseCommande;
    }

    private envoyerEchange(commande: Commande): ReponseCommande {
        const reponseCommande = {
            idJoueur: this.joueur.id,
            nomJoueur: this.joueur.nom,
            type: 'echanger',
            argument: '',
            resultat: '',
            succes: false,
            messageErreur: '',
            score: 0,
        };
        if (1 <= commande.argument.length && commande.argument.length <= MAX_ECHANGE) {
            if (this.chaineContientLettres(commande.argument)) {
                return this.echangeLettreService.echangerLettres(commande.argument);
            } else reponseCommande.messageErreur = 'Les caractères que vous voulez échanger ne sont pas valides.';
        } else reponseCommande.messageErreur = "Erreur de syntaxe! Exemple d'échange valide -> !echanger abc.";
        return reponseCommande;
    }

    private envoyerPlacement(commande: Commande): ReponseCommande {
        const commandeSplit = commande.argument.split(' ');
        const coordonnee = commandeSplit[0];
        const lettresAPlacer = commandeSplit[1];
        const reponseCommande = {
            idJoueur: this.joueur.id,
            nomJoueur: this.joueur.nom,
            type: 'placer',
            argument: commande.argument,
            resultat: JSON.stringify({ coordonnes: [], lettres: [] }),
            succes: false,
            messageErreur: '',
            score: 0,
        };

        if (commandeSplit.length === 2 && lettresAPlacer !== '' && coordonnee !== '') {
            const uneSeuleLettre = lettresAPlacer.length === 1 ? true : false;
            let formatCoordonnee: RegExp;
            let aOrientation: boolean;
            const testOrientation = /[hv]/;
            const orientation = coordonnee.charAt(coordonnee.length - 1);
            if (uneSeuleLettre && !testOrientation.test(orientation)) {
                formatCoordonnee = /\b([a-o])([1-9]|1[0-5])\b/;
                aOrientation = false;
            } else {
                formatCoordonnee = /\b([a-o])([1-9]|1[0-5])([hv])\b/;
                aOrientation = true;
            }

            if (!formatCoordonnee.test(coordonnee) && !uneSeuleLettre) {
                reponseCommande.messageErreur = 'Erreur de syntaxe! Les coordonnées doivent être dans le format [a-o][1-15][h ou v].';
                return reponseCommande;
                // return JSON.stringify({
                //     message: 'Erreur de syntaxe! Les coordonnées doivent être dans le format [a-o][1-15][h ou v].',
                //     type: 'echec',
                // });
            } else if (!formatCoordonnee.test(coordonnee) && uneSeuleLettre) {
                reponseCommande.messageErreur =
                    'Erreur de syntaxe! ' +
                    'Les coordonnées doivent être dans le format [a-o][1-15][h ou v] (orientation optionnelle pour une seule lettre placée).';
                return reponseCommande;
                // return JSON.stringify({
                //     message:
                //         'Erreur de syntaxe! ' +
                //         'Les coordonnées doivent être dans le format [a-o][1-15][h ou v] (orientation optionnelle pour une seule lettre placée).',
                //     type: 'echec',
                // });
            }

            if (!this.chevaletALettres(lettresAPlacer)) {
                reponseCommande.messageErreur = 'Votre chevalet ne contient pas toutes les lettres que vous voulez placer.';
                return reponseCommande;
            }

            const coordonneesTraduites = this.extraireCoordonnees(coordonnee, aOrientation);
            const placementLettres = this.placerLettresService.interpreterCommande(
                lettresAPlacer,
                coordonneesTraduites.coordonnee,
                coordonneesTraduites.estHorizontal,
            );
            if (placementLettres.succes && placementLettres.score !== MOT_INVALIDE) {
                this.placerLettresService.finirTour();
                this.joueur.augmenterPointage(placementLettres.score);
                this.remplacerLettres(lettresAPlacer);
                const reponse = JSON.parse(placementLettres.resultat);
                reponse.chevalet = this.joueur.chevalet;
                placementLettres.resultat = JSON.stringify(reponse);
            }
            placementLettres.argument = commande.argument;
            return placementLettres;
        }
        reponseCommande.messageErreur = 'Erreur de syntaxe! Exemple de placement valide -> !placer g9h adant.';
        return reponseCommande;
        // return JSON.stringify({ message: 'Erreur de syntaxe! Exemple de placement valide -> !placer g9h adant.', type: 'echec' });
    }

    private remplacerLettres(lettresARemplacer: string): void {
        for (let lettre of lettresARemplacer) {
            if (lettre.match(/[A-Z]/)) lettre = '*';
            this.joueur.chevalet.retirerLettre(lettre);
        }
    }

    private extraireCoordonnees(charEntres: string, aOrientation: boolean): { coordonnee: { x: number; y: number }; estHorizontal: boolean } {
        const coordonnee = { coordonnee: { x: 0, y: 0 }, estHorizontal: true };
        const y = charEntres.charAt(0);
        coordonnee.coordonnee.y = y.charCodeAt(0) - 'a'.charCodeAt(0);
        let x: string;
        if (aOrientation) {
            x = charEntres.slice(1, charEntres.length - 1);
            const orientation = charEntres.charAt(charEntres.length - 1);
            if (orientation === 'h') coordonnee.estHorizontal = true;
            else coordonnee.estHorizontal = false;
        } else {
            x = charEntres.slice(1);
        }
        coordonnee.coordonnee.x = parseInt(x, 10) - 1;

        return coordonnee;
    }

    private convertirEnPlacement(lettres: string, coordonnee: { x: number; y: number }, estHorizontal: boolean): string {
        let placement = '!placer ';
        placement += String.fromCharCode(coordonnee.y + 'a'.charCodeAt(0));
        placement += (coordonnee.x + 1).toString();
        if (lettres.length > 1) {
            if (estHorizontal) placement += 'h';
            else placement += 'v';
        }
        placement += ' ' + lettres;
        return placement;
    }

    private chevaletALettres(lettres: string): boolean {
        let chevaletString = '';
        for (const lettre of this.joueur.chevalet.lettres) {
            chevaletString += lettre.lettre;
        }
        for (let lettre of lettres) {
            if (lettre.match(/[A-Z]/)) lettre = '*';
            const index = chevaletString.indexOf(lettre);
            if (index < 0) return false;
            else chevaletString = chevaletString.replace(lettre, '');
        }
        return true;
    }

    private chaineContientLettres(chaine: string): boolean {
        let contientLettres = false;
        for (let i = 0; i < chaine.length; i++) {
            if (ALPHABET.includes(chaine.charAt(i))) {
                contientLettres = true;
            } else return false;
        }
        return contientLettres;
    }
}
