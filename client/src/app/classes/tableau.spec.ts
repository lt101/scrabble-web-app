/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Coordonnee } from '@app/interfaces/coordonnee';
import { Lettre } from './lettre';
import { Tableau } from './tableau';

describe('Tableau', () => {
    let tableau: Tableau;
    let mot: Lettre[];
    let coors: Coordonnee[];

    beforeEach(() => {
        tableau = new Tableau();
        mot = Array<Lettre>();
        coors = Array<Coordonnee>();
        let coor = { x: 7, y: 4 };
        for (const lettre of 'avion') {
            mot.push(new Lettre(lettre));
            coors.push(coor);
            coor = { x: coor.x, y: coor.y + 1 };
        }
    });

    it('should create an instance', () => {
        expect(new Tableau()).toBeTruthy();
    });

    it(' les lettres devraient être undefined à la construction', () => {
        expect(new Tableau().lettresPlacees[0][7]).toBeUndefined();
        expect(new Tableau().lettresPlacees[3][14]).toBeUndefined();
        expect(new Tableau().lettresPlacees[6][5]).toBeUndefined();
        expect(new Tableau().lettresPlacees[9][8]).toBeUndefined();
        expect(new Tableau().lettresPlacees[12][1]).toBeUndefined();
    });

    it(' placerLettres devrait placer les lettres dans le Tableau', () => {
        tableau.placerLettres(mot, coors);
        for (let i = 0; i < mot.length; i++) {
            expect(tableau.lettresPlacees[coors[i].x][coors[i].y].lettre).toEqual(mot[i].lettre);
        }
    });

    it(' retirerLettres devrait retirer les lettres du Tableau', () => {
        tableau.placerLettres(mot, coors);
        tableau.retirerLettres(coors);
        for (const coor of coors) {
            expect(tableau.lettresPlacees[coor.x][coor.y]).toBeUndefined();
        }
    });

    it(' placerLettres devrait sauter par dessus les lettres déjà dans le Tableau', () => {
        const mot2 = new Array<Lettre>();
        const coors2 = [
            { x: 6, y: 7 },
            { x: 8, y: 7 },
            { x: 9, y: 7 },
            { x: 10, y: 7 },
        ];
        for (const lettre of 'crne') {
            mot2.push(new Lettre(lettre));
        }
        tableau.placerLettres(mot, coors);
        tableau.placerLettres(mot2, coors2);
        const coor: Coordonnee = { x: 6, y: 7 };
        for (const lettre of 'corne') {
            expect(tableau.lettresPlacees[coor.x][coor.y].lettre).toEqual(lettre);
            coor.x++;
        }
    });

    it(' retirerLettres devrait sauter par dessus les lettre dans le chemin', () => {
        const mot2 = new Array<Lettre>();
        const coors2 = [
            { x: 6, y: 7 },
            { x: 8, y: 7 },
            { x: 9, y: 7 },
            { x: 10, y: 7 },
        ];
        for (const lettre of 'crne') {
            mot2.push(new Lettre(lettre));
        }
        tableau.placerLettres(mot, coors);
        tableau.placerLettres(mot2, coors2);
        tableau.retirerLettres(coors2);
        const coor: Coordonnee = { x: 6, y: 7 };
        for (; coor.x < 11; coor.x++) {
            if (coor.x === 7) expect(tableau.lettresPlacees[7][7].lettre).toEqual('o');
            else expect(tableau.lettresPlacees[coor.x][coor.y]).toBeUndefined();
        }
    });

    it(' placerLettres ne devrait pas modifier le Tableau si le placement est invalide', () => {
        const coors2 = [
            { x: 6, y: 7 },
            { x: 8, y: 7 },
            { x: 9, y: 7 },
            { x: 10, y: 7 },
            { x: 15, y: 15 },
        ];
        coors2.push({ x: 11, y: 7 });
        expect(tableau.placerLettres(mot, coors2)).toBeFalse();
        coors2.pop();
        expect(tableau.placerLettres(mot, coors2)).toBeFalse();
        expect(tableau.lettresPlacees[10][7]).toBeUndefined();
    });

    it('coorHorsTableau devrait retourner true si la coor est hors tableau', () => {
        let coor = { x: -1, y: 12 };
        // eslint-disable-next-line dot-notation
        expect(tableau['coorHorsTableau'](coor)).toBeTrue();
        coor = { x: 0, y: 16 };
        // eslint-disable-next-line dot-notation
        expect(tableau['coorHorsTableau'](coor)).toBeTrue();
    });

    it('retirerLettre ne devrait pas s effectuer si coor hors tableau', () => {
        let coor = { x: 12, y: 12 };
        for (let _ = 0; _ < 5; _++) {
            coors.push(coor);
            coor = { x: coor.x, y: coor.y + 1 };
        }
        expect(tableau.retirerLettres(coors)).toBeFalse();
    });
});
