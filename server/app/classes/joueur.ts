import { Chevalet } from './chevalet';
export class Joueur {
    pointage: number;
    nom: string;
    id: string;
    estMonTour: boolean;
    chevalet: Chevalet;

    constructor(nom: string, id: string) {
        this.nom = nom;
        this.id = id;
        this.estMonTour = false;
        this.pointage = 0;
        this.chevalet = new Chevalet();
    }

    augmenterPointage(pointage: number) {
        this.pointage += pointage;
    }
}
