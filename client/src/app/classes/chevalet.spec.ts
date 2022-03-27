/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Chevalet } from './chevalet';
import { Lettre } from './lettre';

describe('Chevalet', () => {
    let chevalet: Chevalet;

    beforeEach(() => {
        chevalet = new Chevalet();
        for (const lettre of 'lett') {
            chevalet.ajouterLettre(new Lettre(lettre));
        }
    });

    it('devrait être créé', () => {
        expect(chevalet).toBeTruthy();
    });

    it('ajouterLettre devrait ajouter une lettre', () => {
        const lettre = new Lettre('a');
        chevalet.ajouterLettre(lettre);
        expect(chevalet.lettres[4]).toBe(lettre);
    });

    it('ajouterLettre ne devrait pas ajouter de lettre si le chevalet contient 7 lettres', () => {
        for (const lettre of 'res') {
            chevalet.ajouterLettre(new Lettre(lettre));
        }
        chevalet.ajouterLettre(new Lettre('x'));
        expect(chevalet.lettres.length).toEqual(7);
        let index = 0;
        for (const lettre of 'lettres') {
            expect(chevalet.lettres[index].lettre).toEqual(lettre);
            index++;
        }
    });

    it('retirerLettre devrait retirer une lettre du chevalet', () => {
        chevalet.retirerLettre(new Lettre('t'));
        expect(chevalet.lettres.length).toEqual(3);
    });

    it('retirerLettre ne devrait pas modifier le chevalet si la lettre ne sy trouve pas', () => {
        chevalet.retirerLettre(new Lettre('x'));
        expect(chevalet.lettres.length).toEqual(4);
    });

    it('retirerLettres ne devrait rien modifier si le chevalet est vide', () => {
        for (const lettre of 'lett') {
            chevalet.retirerLettre(new Lettre(lettre));
        }
        expect(chevalet.lettres.length).toEqual(0);
        chevalet.retirerLettre(new Lettre('t'));
        expect(chevalet.lettres.length).toEqual(0);
    });

    it('taille devrait retourner le length de lettres', () => {
        expect(chevalet.taille).toEqual(chevalet.lettres.length);
    });
});
