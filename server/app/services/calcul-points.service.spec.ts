/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */

import { Joueur } from '@app/classes/joueur';
import { Lettre } from '@app/classes/lettre';
import { Mot } from '@app/classes/mot';
import { expect } from 'chai';
import { PlacementLettresService } from './placement-lettres.service';

describe('Calcul Points Service', () => {
    it('verification du constructeur lettre', (done: Mocha.Done) => {
        const lettreA = new Lettre('a');
        expect(lettreA.lettre).to.be.a('string').and.to.equals('a');
        expect(lettreA.valeur).to.be.a('number').and.to.equals(1);
        const lettreZ = new Lettre('z');
        expect(lettreZ.lettre).to.be.a('string').and.to.equals('z');
        expect(lettreZ.valeur).to.be.a('number').and.to.equals(10);
        const lettreBlanche = new Lettre('E');
        expect(lettreBlanche.lettre).to.be.a('string').and.to.equals('E');
        expect(lettreBlanche.valeur).to.be.a('number').and.to.equals(0);
        const lettreInvalide = new Lettre('&');
        expect(lettreInvalide.lettre).to.be.a('string').and.to.equals('&');
        expect(lettreInvalide.valeur).to.be.a('number').and.to.equals(0);
        done();
    });

    const placement = new PlacementLettresService(new Joueur('joueurTest', ''));
    const calculPoints = placement['calculPoint'];
    calculPoints['plateau'] = placement.plateau;

    it('calcul pointage pour mot individuel', () => {
        const balleH = new Mot('balle', { x: 3, y: 7 }, true);
        expect(calculPoints['calculMotIndividuel'](balleH)).to.be.a('number').and.to.equals(7);

        const balleV = new Mot('ballE', { x: 3, y: 7 }, false);
        expect(calculPoints['calculMotIndividuel'](balleV)).to.be.a('number').and.to.equals(6);
    });
});
