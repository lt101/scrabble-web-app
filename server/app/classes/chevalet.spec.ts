import { expect } from 'chai';
import { Chevalet } from './chevalet';

describe('Chevalet', () => {
    let chevaletTest: Chevalet;

    beforeEach(() => {
        chevaletTest = new Chevalet();
    });

    it('devrait être créé', () => {
        expect(chevaletTest).to.be.instanceof(Chevalet);
    });

    it('ajouterLettre devrait ajouter des lettres si il y a de la place', () => {
        chevaletTest.ajouterLettre('abc');
        expect(chevaletTest.nombreDeLettres()).to.equal(3);
        expect(chevaletTest.contientLettre('a')).to.equal(true);
        expect(chevaletTest.contientLettre('b')).to.equal(true);
        expect(chevaletTest.contientLettre('c')).to.equal(true);
    });

    it('ajouterLettre devrait rien ajouter si l ajout est non valide', () => {
        expect(chevaletTest.ajouterLettre('asdfghhk')).to.equal(false);
    });

    it('nombreDeLettres devrait retourner le nombre de lettres du chevalet', () => {
        chevaletTest.ajouterLettre('aa');
        expect(chevaletTest.nombreDeLettres()).to.equal(2);
    });

    it('contientLettre devrait retourner true si la lettre est dans le chevalet', () => {
        chevaletTest.ajouterLettre('az');
        expect(chevaletTest.contientLettre('z')).to.equal(true);
    });

    it('contientLettre devrait retourner false si la lettre est pas dans le chevalet', () => {
        chevaletTest.ajouterLettre('aa');
        expect(chevaletTest.contientLettre('b')).to.equal(false);
    });

    it('retirerLettre devrait retirer la lettre si possible', () => {
        chevaletTest.ajouterLettre('abc');
        expect(chevaletTest.retirerLettre('a')).to.equal(true);
        expect(chevaletTest.nombreDeLettres()).to.equal(2);
    });

    it('retirerLettre ne devrait pas retirer la lettre si ce n est pas possible', () => {
        chevaletTest.ajouterLettre('ab');
        expect(chevaletTest.retirerLettre('g')).to.equal(false);
        expect(chevaletTest.nombreDeLettres()).to.equal(2);
    });
});
