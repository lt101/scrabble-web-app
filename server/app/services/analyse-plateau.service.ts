import { CENTRE_TABLEAU, MOT_INVALIDE, PLATEAU_TAILLE } from '@app/constantes/placement-lettres.constantes';
import { Placement } from '@app/interfaces/placement';
import { Service } from 'typedi';
import { PlacementLettresService } from './placement-lettres.service';

@Service()
export class AnalysePlateauService {
    private placerLettresService: PlacementLettresService;
    private combinaison: Set<string>;
    private casesRemplies: boolean[][];

    constructor(placerLettresService: PlacementLettresService) {
        this.placerLettresService = placerLettresService;
        this.combinaison = new Set();
        this.casesRemplies = new Array<boolean[]>();
    }

    // ignore lettre blanche pour l'instant
    analyserAvecChevalet(): Placement[] {
        let chevalet = '';
        for (const lettre of this.placerLettresService.joueur.chevalet.lettres) {
            if (lettre.lettre !== '*') {
                chevalet += lettre.lettre;
            }
        }
        return this.trouverPlacementsValides(chevalet);
    }

    private genererAnagrames(lettres: string): Set<string> {
        const anagrames: Set<string> = new Set();
        const etapes: string[][] = [];
        const longueur = lettres.length;
        if (longueur === 0) {
            return anagrames;
        }
        for (let _ = 0; _ < longueur; _++) {
            etapes.push([]);
        }
        etapes[0] = [lettres.charAt(0) as string];
        for (let i = 1; i < longueur; i++) {
            for (const anagrame of etapes[i - 1]) {
                for (let j = 0; j <= i; j++) {
                    etapes[i].push(anagrame.slice(0, j) + lettres.charAt(i) + anagrame.slice(j));
                }
            }
        }

        for (const anagrame of etapes[etapes.length - 1]) {
            anagrames.add(anagrame);
        }
        return anagrames;
    }

    // inspire de http://www.mytechinterviews.com/combinations-of-a-string
    // combinaisonCourante = '' et index = 0 au premier appel
    private genererCombinaisons(lettres: string, combinaisonCourante: string, index: number): void {
        for (let i = index; i < lettres.length; i++) {
            combinaisonCourante += lettres.charAt(i);
            this.combinaison.add(combinaisonCourante);
            this.genererCombinaisons(lettres, combinaisonCourante, i + 1);
            combinaisonCourante = combinaisonCourante.slice(0, combinaisonCourante.length - 1);
        }
    }

    private genererPermutations(lettres: string): string[] {
        this.combinaison = new Set();
        this.genererCombinaisons(lettres, '', 0);
        const permutations = [];
        for (const combinaison of this.combinaison) {
            const anagrames = this.genererAnagrames(combinaison);
            for (const anagrame of anagrames) {
                permutations.push(anagrame);
            }
        }
        return permutations;
    }

    private trouverPlacementsValides(chevalet: string): Placement[] {
        const placementValides = [];
        const permutations = this.genererPermutations(chevalet);
        const tempsDebut = new Date().getTime();
        const timeout = 9900;
        this.trouverCasesRemplies();

        for (const permutation of permutations) {
            const longueur = permutation.length;
            const coordonneeMax = PLATEAU_TAILLE - longueur;
            for (let i = 0; i < PLATEAU_TAILLE; i++) {
                for (let j = 0; j < PLATEAU_TAILLE; j++) {
                    const coordonnee = { x: i, y: j };
                    if (i <= coordonneeMax && this.verifierPrePlacement(longueur, coordonnee, true)) {
                        const placementHorizontal = this.placerLettresService.interpreterCommande(permutation, coordonnee, true);
                        if (placementHorizontal.succes && placementHorizontal.score !== MOT_INVALIDE) {
                            this.placerLettresService.retirerLettres();
                            placementValides.push({ lettres: permutation, coordonnee, estHorizontal: true, score: placementHorizontal.score });
                        }
                    }
                    if (j <= coordonneeMax && longueur !== 1 && this.verifierPrePlacement(longueur, coordonnee, false)) {
                        const placementVertical = this.placerLettresService.interpreterCommande(permutation, coordonnee, false);
                        if (placementVertical.succes && placementVertical.score !== MOT_INVALIDE) {
                            this.placerLettresService.retirerLettres();
                            placementValides.push({ lettres: permutation, coordonnee, estHorizontal: false, score: placementVertical.score });
                        }
                    }
                }
            }

            const tempsFin = new Date().getTime();
            if (tempsFin - tempsDebut > timeout) {
                break;
            }
        }
        return placementValides;
    }

    private trouverCasesRemplies(): void {
        this.casesRemplies = new Array<boolean[]>();
        for (let i = 0; i < PLATEAU_TAILLE; i++) {
            this.casesRemplies.push(new Array<boolean>());
            for (let j = 0; j < PLATEAU_TAILLE; j++) {
                this.casesRemplies[i].push(false);
                if (this.placerLettresService.plateau[i][j].lettreContenue.lettre !== '') {
                    this.casesRemplies[i][j] = true;
                }
            }
        }
    }

    private toucheCentre(longueur: number, coordonneeDebut: { x: number; y: number }, estHorizontal: boolean) {
        if (estHorizontal) {
            return coordonneeDebut.y === CENTRE_TABLEAU && coordonneeDebut.x + longueur > CENTRE_TABLEAU;
        } else {
            return coordonneeDebut.x === CENTRE_TABLEAU && coordonneeDebut.y + longueur > CENTRE_TABLEAU;
        }
    }

    private aDesVoisins(longueur: number, coordonneeDebut: { x: number; y: number }, estHorizontal: boolean) {
        const coordonnee = { x: coordonneeDebut.x, y: coordonneeDebut.y };
        for (let i = 0; i < longueur; i++) {
            if (estHorizontal) {
                coordonnee.x = coordonneeDebut.x + i;
                if (coordonnee.x >= PLATEAU_TAILLE) {
                    return false;
                }
            } else {
                coordonnee.y = coordonneeDebut.y + i;
                if (coordonnee.y >= PLATEAU_TAILLE) {
                    return false;
                }
            }
            const voisins = this.genererVoisins(longueur, coordonnee, estHorizontal, i);
            for (const voisin of voisins) {
                if (this.casesRemplies[voisin.x][voisin.y]) {
                    return true;
                }
            }
        }
        return false;
    }

    private verifierPrePlacement(longueur: number, coordonnee: { x: number; y: number }, estHorizontal: boolean): boolean {
        return this.placerLettresService.estPremierPlacement
            ? this.toucheCentre(longueur, coordonnee, estHorizontal)
            : this.aDesVoisins(longueur, coordonnee, estHorizontal);
    }

    private genererVoisins(
        longueur: number,
        coordonnee: { x: number; y: number },
        estHorizontal: boolean,
        index: number,
    ): { x: number; y: number }[] {
        const voisins = [];

        if (index === 0 && (estHorizontal ? coordonnee.x : coordonnee.y) > 0)
            voisins.push(estHorizontal ? { x: coordonnee.x - 1, y: coordonnee.y } : { x: coordonnee.x, y: coordonnee.y - 1 });
        else if (index === longueur - 1 && (estHorizontal ? coordonnee.x : coordonnee.y) < PLATEAU_TAILLE - 1)
            voisins.push(estHorizontal ? { x: coordonnee.x + 1, y: coordonnee.y } : { x: coordonnee.x, y: coordonnee.y + 1 });

        if ((estHorizontal ? coordonnee.y : coordonnee.x) > 0)
            voisins.push(estHorizontal ? { x: coordonnee.x, y: coordonnee.y - 1 } : { x: coordonnee.x - 1, y: coordonnee.y });
        if ((estHorizontal ? coordonnee.y : coordonnee.x) < PLATEAU_TAILLE - 1)
            voisins.push(estHorizontal ? { x: coordonnee.x, y: coordonnee.y + 1 } : { x: coordonnee.x + 1, y: coordonnee.y });
        return voisins;
    }
}
