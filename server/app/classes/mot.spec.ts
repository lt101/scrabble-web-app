/* eslint-disable dot-notation */
import { expect } from 'chai';
import { Mot } from './mot';

describe('Mot', () => {
    const coordX = 10;
    const coordY = 20;

    it('constructeur de mot devrait bien initialiser les coordonnees', () => {
        const mot = new Mot('mot', { x: coordX, y: coordY });
        expect(mot.x).to.equal(coordX);
        expect(mot.y).to.equal(coordY);
    });

    it('nettoyerMot devrait nettoyer le mot formatter le mot', () => {
        const mot = new Mot('mot', { x: coordX, y: coordY });
        expect(mot['nettoyerMot']('ça')).to.equal('ca');
    });
});
