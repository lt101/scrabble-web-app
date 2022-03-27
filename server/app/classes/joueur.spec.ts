import { expect } from 'chai';
import { Joueur } from './joueur';

describe('Joueur', () => {
    const joueurTest = new Joueur('test', '');

    it('constructeur devrait pouvoir prendre un id en parametre', () => {
        const joueurTest1 = new Joueur('test1', 'testId');
        expect(joueurTest1.id).to.equal('testId');
    });

    it('augmenterPointage devrait augmenter le pointage du joueur avec la valeur specifiee', () => {
        joueurTest.augmenterPointage(2);
        expect(joueurTest.pointage).to.equal(2);
    });
});
