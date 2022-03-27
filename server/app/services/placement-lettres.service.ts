import { Case } from '@app/classes/case';
import { Joueur } from '@app/classes/joueur';
import { Lettre } from '@app/classes/lettre';
import { Mot } from '@app/classes/mot';
import { initialiserBonus } from '@app/constantes/initialiser-tableau';
import { CENTRE_TABLEAU, LETTRES_CHEVALET_MAX, MOT_INVALIDE, PLATEAU_TAILLE, POINTS_BONUS } from '@app/constantes/placement-lettres.constantes';
import {
    ERREUR_CASE_NON_VIDE,
    ERREUR_HORS_CENTRE,
    ERREUR_HORS_PLATEAU,
    ERREUR_NON_ADJACENT,
    ERREUR_UNE_SEULE_LETTRE,
} from '@app/constantes/placement-lettres.erreurs';
import { ReponseCommande } from '@app/interfaces/reponse-commande';
import { Service } from 'typedi';
import { CalculPointsService } from './calcul-points.service';

@Service()
export class PlacementLettresService {
    plateau: Case[][];
    estPremierPlacement: boolean;
    joueur: Joueur;
    private lettresAjouteeCeTour: { x: number; y: number }[];
    private motCrees: Mot[];
    private calculPoint: CalculPointsService;

    constructor(joueur: Joueur) {
        this.joueur = joueur;
        this.plateau = this.creerTableauVide();
        this.estPremierPlacement = true;
        this.lettresAjouteeCeTour = [];
        this.motCrees = [];
        this.calculPoint = new CalculPointsService();
    }

    interpreterCommande(lettres: string, coordonnee: { x: number; y: number }, estHorizontal: boolean): ReponseCommande {
        const reponseCommande = {
            idJoueur: this.joueur.id,
            nomJoueur: this.joueur.nom,
            type: 'placer',
            argument: lettres,
            resultat: JSON.stringify({ coordonnes: [], lettres: [] }),
            succes: false,
            messageErreur: '',
            score: 0,
        };
        if (!this.coordonneeEstValide(coordonnee)) {
            reponseCommande.messageErreur = ERREUR_HORS_PLATEAU;
        } else if (this.plateau[coordonnee.x][coordonnee.y].lettreContenue.lettre !== '') {
            reponseCommande.messageErreur = ERREUR_CASE_NON_VIDE;
        } else if (this.estPremierPlacement && lettres.length === 1) {
            reponseCommande.messageErreur = ERREUR_UNE_SEULE_LETTRE;
        } else {
            return this.ajouterLettres(lettres, coordonnee, estHorizontal);
        }
        return reponseCommande;
    }

    retirerLettres(): void {
        for (const coordonnee of this.lettresAjouteeCeTour) {
            this.plateau[coordonnee.x][coordonnee.y].lettreContenue.lettre = '';
            this.plateau[coordonnee.x][coordonnee.y].estRemplieCeTour = false;
        }
        this.lettresAjouteeCeTour = [];
    }

    // desactive les bonus des cases deja remplies
    finirTour(): void {
        this.estPremierPlacement = false;
        this.lettresAjouteeCeTour = [];
        for (const ligne of this.plateau) {
            for (const caseCourante of ligne) {
                if (caseCourante.lettreContenue.lettre !== '') {
                    caseCourante.estRemplieCeTour = false;
                }
            }
        }
        this.motCrees = [];
    }

    private creerTableauVide(): Case[][] {
        const tableau2D = new Array<Case[]>();
        for (let i = 0; i < PLATEAU_TAILLE; i++) {
            tableau2D.push(new Array<Case>());
            for (let _ = 0; _ < PLATEAU_TAILLE; _++) {
                tableau2D[i].push(new Case());
            }
        }
        return initialiserBonus(tableau2D);
    }
    private coordonneeEstValide(coordonnee: { x: number; y: number }): boolean {
        const xEstValide = 0 <= coordonnee.x && coordonnee.x < PLATEAU_TAILLE;
        const yEstValide = 0 <= coordonnee.y && coordonnee.y < PLATEAU_TAILLE;
        return xEstValide && yEstValide;
    }

    private ajouterLettres(lettres: string, coordonnee: { x: number; y: number }, estHorizontal: boolean): ReponseCommande {
        this.lettresAjouteeCeTour = [];
        let aToucheLeCentre = false;
        let i = 0;
        let j = 0;
        const x = coordonnee.x;
        const y = coordonnee.y;
        const lettresAPlacer = [];
        const reponseCommande = {
            idJoueur: this.joueur.id,
            nomJoueur: this.joueur.nom,
            type: 'placer',
            argument: lettres,
            resultat: JSON.stringify({ coordonnes: [], lettres: [] }),
            succes: false,
            messageErreur: '',
            score: 0,
        };

        for (const lettre of lettres) {
            while (this.plateau[x + i][y + j].lettreContenue.lettre !== '') {
                if (estHorizontal) {
                    i++;
                } else {
                    j++;
                }
                if (!this.coordonneeEstValide({ x: x + i, y: y + j })) {
                    this.retirerLettres();
                    reponseCommande.messageErreur = ERREUR_HORS_PLATEAU;
                    return reponseCommande;
                    // return { message: ERREUR_HORS_PLATEAU, type: 'echec', score: 0, coordonnes: [], lettres: [] };
                }
            }
            if (x + i === CENTRE_TABLEAU && y + j === CENTRE_TABLEAU) {
                aToucheLeCentre = true;
            }

            this.plateau[x + i][y + j].lettreContenue = new Lettre(lettre);
            lettresAPlacer.push(new Lettre(lettre));
            this.plateau[x + i][y + j].estRemplieCeTour = true;
            this.lettresAjouteeCeTour.push({ x: x + i, y: y + j });
        }

        if (this.estPremierPlacement && !aToucheLeCentre) {
            this.retirerLettres();
            reponseCommande.messageErreur = ERREUR_HORS_CENTRE;
            return reponseCommande;
            // return { message: ERREUR_HORS_CENTRE, type: 'echec', score: 0, coordonnes: [], lettres: [] };
        }

        if (!this.estPremierPlacement && !this.motADesVoisins()) {
            this.retirerLettres();
            reponseCommande.messageErreur = ERREUR_NON_ADJACENT;
            return reponseCommande;
            // return { message: ERREUR_NON_ADJACENT, type: 'echec', score: 0, coordonnes: [], lettres: [] };
        }

        const copieCoordonnees = this.lettresAjouteeCeTour;

        const motsNouveaux = this.motsNouvellementFormes(coordonnee, estHorizontal, lettres.length);

        reponseCommande.succes = true;
        reponseCommande.score = motsNouveaux.score;
        reponseCommande.resultat = JSON.stringify({
            coordonnes: copieCoordonnees,
            lettres: lettresAPlacer,
            motsInvalides: motsNouveaux.motsInvalides,
        });
        return reponseCommande;
        // return { message: '', type: 'succes', score: motsNouveaux.score, coordonnes: copieCoordonnees,
        //  lettres: lettresAPlacer, motsInvalides: motsNouveaux.motsInvalides };
    }

    private motsNouvellementFormes(
        coordonnee: { x: number; y: number },
        estHorizontal: boolean,
        nombreLettres: number,
    ): { motsInvalides: string[]; score: number } {
        let i = 0;
        let j = 0;
        const x = coordonnee.x;
        const y = coordonnee.y;
        const motsFormes = [];
        const aAtteindLaFin = false;
        const aAtteindLeDebut = false;
        let motParallele = '';
        let debutDuMot: { x: number; y: number };

        while (!aAtteindLeDebut) {
            if (estHorizontal) {
                i--;
            } else {
                j--;
            }
            if (!this.coordonneeEstValide({ x: x + i, y: y + j })) {
                break;
            }
            if (this.plateau[x + i][y + j].lettreContenue.lettre === '') {
                break;
            }
        }

        if (estHorizontal) {
            debutDuMot = { x: x + i + 1, y: y + j };
        } else {
            debutDuMot = { x: x + i, y: y + j + 1 };
        }

        while (!aAtteindLaFin) {
            if (estHorizontal) {
                i++;
            } else {
                j++;
            }
            if (!this.coordonneeEstValide({ x: x + i, y: y + j })) {
                break;
            }
            if (this.plateau[x + i][y + j].lettreContenue.lettre === '') {
                break;
            }
            motParallele += this.plateau[x + i][y + j].lettreContenue.lettre;
            if (this.plateau[x + i][y + j].estRemplieCeTour) {
                const motPerpendiculaire = this.motPerpendiculaire({ x: x + i, y: y + j }, estHorizontal);
                if (motPerpendiculaire.extraireString().length > 1) {
                    motsFormes.push(motPerpendiculaire);
                }
            }
        }
        if (motParallele.length > 1) {
            motsFormes.push(new Mot(motParallele, debutDuMot, estHorizontal));
            this.motCrees.push(new Mot(motParallele, debutDuMot, estHorizontal));
        }

        const message = this.calculPoint.calculMots(motsFormes, this.plateau);
        if (message.score !== MOT_INVALIDE) {
            if (nombreLettres === LETTRES_CHEVALET_MAX) {
                return {
                    motsInvalides: [],
                    score: message.score + POINTS_BONUS,
                };
            } else {
                return message;
            }
        } else {
            this.retirerLettres();
            return message;
        }
    }

    private motPerpendiculaire(coordonnee: { x: number; y: number }, estHorizontal: boolean): Mot {
        let i = 0;
        let j = 0;
        const x = coordonnee.x;
        const y = coordonnee.y;
        const aAtteindLaFin = false;
        const aAtteindLeDebut = false;
        let motPerpendiculaire = '';
        let debutDuMot: { x: number; y: number };
        while (!aAtteindLeDebut) {
            if (!estHorizontal) {
                i--;
            } else {
                j--;
            }
            if (!this.coordonneeEstValide({ x: x + i, y: y + j })) {
                break;
            }
            if (this.plateau[x + i][y + j].lettreContenue.lettre === '') {
                break;
            }
        }

        if (!estHorizontal) {
            debutDuMot = { x: x + i + 1, y: y + j };
        } else {
            debutDuMot = { x: x + i, y: y + j + 1 };
        }

        while (!aAtteindLaFin) {
            if (!estHorizontal) {
                i++;
            } else {
                j++;
            }
            if (!this.coordonneeEstValide({ x: x + i, y: y + j })) {
                break;
            }
            if (this.plateau[x + i][y + j].lettreContenue.lettre === '') {
                break;
            }
            motPerpendiculaire += this.plateau[x + i][y + j].lettreContenue.lettre;
        }
        if (motPerpendiculaire.length > 1) {
            this.motCrees.push(new Mot(motPerpendiculaire, debutDuMot, !estHorizontal));
            return new Mot(motPerpendiculaire, debutDuMot, !estHorizontal);
        }
        return new Mot('1');
    }

    private motADesVoisins(): boolean {
        for (const coordonnee of this.lettresAjouteeCeTour) {
            const voisins = [];
            voisins.push({ x: coordonnee.x - 1, y: coordonnee.y });
            voisins.push({ x: coordonnee.x + 1, y: coordonnee.y });
            voisins.push({ x: coordonnee.x, y: coordonnee.y - 1 });
            voisins.push({ x: coordonnee.x, y: coordonnee.y + 1 });
            for (const voisin of voisins) {
                if (this.estLettreVoisinne(voisin)) {
                    return true;
                }
            }
        }
        return false;
    }

    private estLettreVoisinne(coordonnee: { x: number; y: number }): boolean {
        return (
            this.coordonneeEstValide(coordonnee) &&
            !this.plateau[coordonnee.x][coordonnee.y].estRemplieCeTour &&
            this.plateau[coordonnee.x][coordonnee.y].lettreContenue.lettre !== ''
        );
    }
}
