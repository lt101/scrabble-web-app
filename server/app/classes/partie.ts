import { MAX_LETTRES_CHEVALET } from '@app/classes/chevalet';
import { Joueur } from '@app/classes/joueur';
import { ECHANGER_PROB, NOMS, PASSER_TOUR_PROB, PLACER_PROB, REMISE_SUR_100, TOUR_MAX } from '@app/constantes/partie.constantes';
import { Commande } from '@app/interfaces/commande';
import { ConfigPartie } from '@app/interfaces/config-partie';
import { InfoFinPartie } from '@app/interfaces/info-fin-partie';
import { InfoPartie } from '@app/interfaces/info-partie';
import { ReponseCommande } from '@app/interfaces/reponse-commande';
import { CommandeService } from '@app/services/commande.service';
import { JoueurVirtuelService } from '@app/services/joueur-virtuel.service';

export enum EtatPartie {
    TourJoueur1,
    TourJoueur2,
    FinPartie,
}

export class Partie {
    partie: InfoPartie;
    finPartie: InfoFinPartie;
    etat: EtatPartie;
    estPartieSolo: boolean;
    private nombreToursPasses: number;
    private nomJV: string;
    private commandeService: CommandeService;
    private joueurVirtuelService: JoueurVirtuelService;

    constructor(config: ConfigPartie, idPartie: string) {
        this.estPartieSolo = false;
        this.nombreToursPasses = 0;
        this.nomJV = '';
        this.partie = {
            joueurs: [],
            idPartie: '',
            joueurActif: new Joueur('', ''),
            reserve: [],
            minuterie: 0,
        };
        this.finPartie = {
            message: '',
            nomGagnant: '',
            scores: [],
        };
        this.obtenirNomAleatoire(config.joueurs[0].nom);
        this.partie.joueurs = [];
        this.partie.idPartie = idPartie;
        this.partie.joueurs.push(new Joueur(config.joueurs[0].nom, config.joueurs[0].id));
        this.partie.joueurs.push(new Joueur(this.nomJV, 'JoueurVirtuel'));
        this.partie.joueurActif = this.partie.joueurs[Math.floor(Math.random() * 2)];
        this.partie.joueurActif.estMonTour = true;
        this.commandeService = new CommandeService(this.partie.joueurActif);
        this.joueurVirtuelService = new JoueurVirtuelService();
        this.pigeInitiale();

        if (config.option === 'solo') this.estPartieSolo = true;
        this.partie.minuterie = config.minuterie;
        this.etat = EtatPartie.TourJoueur1;
    }

    traiterCommande(commande: Commande): ReponseCommande {
        if (this.etat === EtatPartie.FinPartie) {
            return {
                idJoueur: commande.idJoueur,
                nomJoueur: commande.nomJoueur,
                type: '',
                argument: '',
                resultat: '',
                succes: false,
                messageErreur: 'La partie est terminée. Vous ne pouvez plus jouer, mais vous pouvez continuer à clavarder.',
                score: 0,
            };
        }
        this.partie.joueurActif.nom = commande.nomJoueur; // TODO: verifier si ca sert a quelque chose
        if (commande.idJoueur !== this.partie.joueurActif.id && commande.type !== 'reserve') {
            return {
                idJoueur: commande.idJoueur,
                nomJoueur: commande.nomJoueur,
                type: '',
                argument: '',
                resultat: '',
                succes: false,
                messageErreur: "Juste un moment! Vous pourrez effectuer une commande lorsque c'est votre tour :)",
                score: 0,
            };
        }

        const resultatDeCommande = this.commandeService.determinerCommande(commande);
        if (resultatDeCommande.succes) {
            if (commande.type === 'passer') this.nombreToursPasses++;
            else this.nombreToursPasses = 0;
            this.avancerEtat();
        } else {
            if (commande.type !== 'reserve' && commande.type !== 'indice')
                resultatDeCommande.messageErreur = resultatDeCommande.messageErreur + ' Veuilez réessayer:';
        }
        return resultatDeCommande;
    }

    tourJoueurVirtuel(): ReponseCommande {
        // TODO: Joeur virtuel doit passer son tour si la reponse commande est un echec
        const action = Math.random() * REMISE_SUR_100;
        const commande: Commande = {
            idJoueur: 'JoueurVirtuel',
            nomJoueur: this.nomJV,
            idPartie: '',
            type: '',
            argument: '',
        };
        switch (true) {
            case action <= PASSER_TOUR_PROB:
                commande.type = 'passer';
                break;

            case PASSER_TOUR_PROB < action && action <= ECHANGER_PROB:
                commande.type = 'echanger';
                if (this.commandeService.echangeLettreService.reserve.reserveLettres.length < MAX_LETTRES_CHEVALET) commande.argument = '';
                else commande.argument = this.joueurVirtuelService.echangeJV(this.partie.joueurActif);
                if (commande.argument === '') commande.type = 'passer';
                break;

            case ECHANGER_PROB < action && action <= PLACER_PROB:
                commande.type = 'placer';
                commande.argument = this.joueurVirtuelService.placementJV(this.commandeService.analysePlateauService.analyserAvecChevalet());
                if (commande.argument === '') commande.type = 'passer';
                break;
        }
        return this.traiterCommande(commande);
    }

    private obtenirNomAleatoire(nomJoueur: string): void {
        this.nomJV = NOMS[Math.floor(Math.random() * 3)];
        while (this.nomJV === nomJoueur) this.nomJV = NOMS[Math.floor(Math.random() * 3)];
    }

    private avancerEtat(): void {
        const differencesDeScore = this.verifierFinPartie();
        if (this.etat === EtatPartie.FinPartie) this.infosDeFinDePartie(differencesDeScore);
        switch (this.etat) {
            case EtatPartie.TourJoueur1: {
                this.changerJoueurActif();
                this.etat = EtatPartie.TourJoueur2;
                break;
            }

            case EtatPartie.TourJoueur2: {
                this.changerJoueurActif();
                this.etat = EtatPartie.TourJoueur1;
                break;
            }

            case EtatPartie.FinPartie: {
                break;
            }
        }
    }

    private infosDeFinDePartie(differencesDeScore: number[]): void {
        let message = '';
        if (this.nombreToursPasses === TOUR_MAX) message += '6 tours de suite ont été passés!\n';
        else {
            message +=
                'Le chevalet de ' +
                (this.partie.joueurs[0].chevalet.nombreDeLettres() === 0 ? this.partie.joueurs[0].nom : this.partie.joueurs[1].nom) +
                ' et la réserve sont vides!\n';
        }
        message += 'Fin de partie - lettres restantes\n';
        for (let i = 0; i < 2; i++) {
            message += this.partie.joueurs[i].nom + ' : ';
            for (const lettre of this.partie.joueurs[i].chevalet.lettres) message += lettre.lettre;
            message += '\n';
        }
        for (let i = 0; i < 2; i++) {
            message +=
                this.partie.joueurs[i].nom +
                (differencesDeScore[i] >= 0 ? ' gagne ' : ' perd ') +
                Math.abs(differencesDeScore[i]).toString() +
                ' points!\n';
        }
        this.finPartie.message = message;
        if (this.partie.joueurs[0].pointage > this.partie.joueurs[1].pointage) {
            this.finPartie.nomGagnant = this.partie.joueurs[0].nom;
        } else if (this.partie.joueurs[0].pointage < this.partie.joueurs[1].pointage) {
            this.finPartie.nomGagnant = this.partie.joueurs[1].nom;
        }
        for (const joueur of this.partie.joueurs) {
            if (joueur.id !== 'JoueurVirtuel') this.finPartie.scores.push({ nom: [joueur.nom], score: joueur.pointage });
        }
    }

    private changerJoueurActif(): void {
        this.finTour();
        this.partie.joueurActif = this.partie.joueurs[0].estMonTour ? this.partie.joueurs[1] : this.partie.joueurs[0];
        this.partie.joueurs[0].estMonTour = !this.partie.joueurs[0].estMonTour;
        this.partie.joueurs[1].estMonTour = !this.partie.joueurs[1].estMonTour;
        this.commandeService.changerJoueur(this.partie.joueurActif);
    }

    private verifierFinPartie(): number[] {
        let differenceDeScore: number[] = [];
        if (this.nombreToursPasses === TOUR_MAX || this.reserveEtChevaletVides()) {
            this.etat = EtatPartie.FinPartie;
            differenceDeScore = this.pointsDeFinDePartie();
        }
        return differenceDeScore;
    }

    private pointsDeFinDePartie(): number[] {
        const scoresChevalet: number[] = [];
        const differenceDeScore: number[] = [];
        this.partie.joueurs.forEach((joueur) => {
            let scoreChevalet = 0;
            for (const lettre of joueur.chevalet.lettres) {
                scoreChevalet += lettre.valeur;
            }
            scoresChevalet.push(scoreChevalet);
            const score = -Math.min(joueur.pointage, scoreChevalet);
            differenceDeScore.push(score);
            joueur.augmenterPointage(score);
        });
        if (this.reserveEtChevaletVides()) {
            for (let i = 0; i < 2; i++) {
                if (this.partie.joueurs[i].chevalet.nombreDeLettres() === 0) {
                    this.partie.joueurs[i].augmenterPointage(scoresChevalet[1 - i]);
                    differenceDeScore[i] += scoresChevalet[1 - i];
                }
            }
        }
        return differenceDeScore;
    }

    private reserveEtChevaletVides(): boolean {
        return (
            this.commandeService.echangeLettreService.reserve.reserveLettres.length === 0 &&
            (this.partie.joueurs[0].chevalet.nombreDeLettres() === 0 || this.partie.joueurs[1].chevalet.nombreDeLettres() === 0)
        );
    }

    private pigeInitiale(): void {
        this.partie.joueurs.forEach((joueur) => {
            joueur.chevalet.ajouterLettre(this.commandeService.echangeLettreService.reserve.piger(MAX_LETTRES_CHEVALET));
        });
        this.partie.reserve = this.commandeService.echangeLettreService.reserve.reserveLettres;
    }

    private finTour(): void {
        this.partie.joueurActif.chevalet.ajouterLettre(
            this.commandeService.echangeLettreService.reserve.piger(MAX_LETTRES_CHEVALET - this.partie.joueurActif.chevalet.nombreDeLettres()),
        );
        this.partie.reserve = this.commandeService.echangeLettreService.reserve.reserveLettres;
    }
}
