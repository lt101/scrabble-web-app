export interface Placement {
    lettres: string;
    coordonnee: {
        x: number;
        y: number;
    };
    estHorizontal: boolean;
    score: number;
}
