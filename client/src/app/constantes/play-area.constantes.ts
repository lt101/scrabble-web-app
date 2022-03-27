// Constantes pour le tableau de cases
export const LARGEUR_DEFAUT = 750;
export const HAUTEUR_DEFAUT = 750;
export const NB_CASES = 15;

// Constante pour écrire les positions des cases
export const POSITIONS = {
    horizontal: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    vertical: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
};

// Constantes pour le dessin de l'étoile
export const N_POINTES = 5;
export const X_ETOILE = ((NB_CASES / 2) * LARGEUR_DEFAUT) / NB_CASES;
export const Y_ETOILE = ((NB_CASES / 2) * HAUTEUR_DEFAUT) / NB_CASES + 2;
export const RAYON_EXTERNE = LARGEUR_DEFAUT / (2 * NB_CASES);
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const RAYON_INTERNE = LARGEUR_DEFAUT / (5 * NB_CASES);
export const POS_ETOILE = 7;

// Constantes pour l'affichage de l'écriture dans les cases
export const DECALAGE_MOT = 0.5;
export const DECALAGE_LETTRE = 0.5;
export const DECALAGE_BONUS_Y = 0.4;
export const MILIEU_CASE = 0.5;
export const DECALAGE_Y_MULTIPLICATEUR = 0.8;
export const ESPACE_ENTRE_MULTIPLICATEUR = 15;
export const ESPACE_ENTRE_MOT = 11;
export const ESPACE_ENTRE_LETTRE = 7;

// Emplacements des cases boni
export const CASES_BONUS: { cases: { x: number; y: number }[][]; couleurs: string[]; ecriture: string[] } = {
    cases: [
        [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 },
            { x: 4, y: 4 },
            { x: 7, y: 7 },
            { x: 13, y: 1 },
            { x: 12, y: 2 },
            { x: 11, y: 3 },
            { x: 10, y: 4 },
            { x: 1, y: 13 },
            { x: 2, y: 12 },
            { x: 3, y: 11 },
            { x: 4, y: 10 },
            { x: 13, y: 13 },
            { x: 12, y: 12 },
            { x: 11, y: 11 },
            { x: 10, y: 10 },
        ],
        [
            { x: 0, y: 0 },
            { x: 7, y: 0 },
            { x: 14, y: 0 },
            { x: 0, y: 7 },
            { x: 14, y: 7 },
            { x: 0, y: 14 },
            { x: 7, y: 14 },
            { x: 14, y: 14 },
        ],
        [
            { x: 3, y: 0 },
            { x: 11, y: 0 },
            { x: 6, y: 2 },
            { x: 8, y: 2 },
            { x: 0, y: 3 },
            { x: 7, y: 3 },
            { x: 14, y: 3 },
            { x: 2, y: 6 },
            { x: 6, y: 6 },
            { x: 8, y: 6 },
            { x: 12, y: 6 },
            { x: 3, y: 7 },
            { x: 11, y: 7 },
            { x: 2, y: 8 },
            { x: 6, y: 8 },
            { x: 8, y: 8 },
            { x: 12, y: 8 },
            { x: 0, y: 11 },
            { x: 7, y: 11 },
            { x: 14, y: 11 },
            { x: 6, y: 12 },
            { x: 8, y: 12 },
            { x: 3, y: 14 },
            { x: 11, y: 14 },
        ],
        [
            { x: 5, y: 1 },
            { x: 9, y: 1 },
            { x: 1, y: 5 },
            { x: 5, y: 5 },
            { x: 9, y: 5 },
            { x: 13, y: 5 },
            { x: 1, y: 9 },
            { x: 5, y: 9 },
            { x: 9, y: 9 },
            { x: 13, y: 9 },
            { x: 5, y: 13 },
            { x: 9, y: 13 },
        ],
    ],
    couleurs: ['#FF000050', '#FF000095', '#0000FF50', '#0000FF95'], // Couleurs en ordre des cases boni
    ecriture: ['Mot X2', 'Mot X3', 'Lettre X2', 'Lettre X3'], // À écrire dans les cases
};
