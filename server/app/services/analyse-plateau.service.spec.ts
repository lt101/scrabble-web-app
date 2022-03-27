/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Joueur } from '@app/classes/joueur';
import { Lettre } from '@app/classes/lettre';
import { MOT_INVALIDE } from '@app/constantes/placement-lettres.constantes';
import { expect } from 'chai';
import { AnalysePlateauService } from './analyse-plateau.service';
import { PlacementLettresService } from './placement-lettres.service';

describe('Analyse Plateau Service', () => {
    let placerLettres: PlacementLettresService;
    let analysePlateau: AnalysePlateauService;
    const joueur = new Joueur('joueurTest', '');

    beforeEach(() => {
        placerLettres = new PlacementLettresService(joueur);
        analysePlateau = new AnalysePlateauService(placerLettres);
    });

    it('genererAnagrames devrait retourner set vide si string vide', () => {
        expect(analysePlateau['genererAnagrames']('')).to.deep.equal(new Set());
    });

    it('genererAnagrames devrait retourner lettre si avec un seul charactere', () => {
        expect(analysePlateau['genererAnagrames']('a')).to.deep.equal(new Set(['a']));
        expect(analysePlateau['genererAnagrames']('Z')).to.deep.equal(new Set(['Z']));
    });

    it('genererAnagrames devrait retourner les bons resultats avec deux lettres', () => {
        expect(analysePlateau['genererAnagrames']('ab')).to.deep.equal(new Set(['ba', 'ab']));
        expect(analysePlateau['genererAnagrames']('aA')).to.deep.equal(new Set(['Aa', 'aA']));
        expect(analysePlateau['genererAnagrames']('aa')).to.deep.equal(new Set(['aa']));
    });

    it('genererAnagrames devrait retourner les bons resultats avec trois lettres', () => {
        expect(analysePlateau['genererAnagrames']('abc')).to.deep.equal(new Set(['cba', 'bca', 'bac', 'cab', 'acb', 'abc']));
        expect(analysePlateau['genererAnagrames']('aab')).to.deep.equal(new Set(['baa', 'aba', 'aab']));
        expect(analysePlateau['genererAnagrames']('aaa')).to.deep.equal(new Set(['aaa']));
    });

    it('genererAnagrames devrait retourner les bons resultats avec quatre lettres', () => {
        expect(analysePlateau['genererAnagrames']('abcd')).to.deep.equal(
            new Set([
                'dcba',
                'cdba',
                'cbda',
                'cbad',
                'dbca',
                'bdca',
                'bcda',
                'bcad',
                'dbac',
                'bdac',
                'badc',
                'bacd',
                'dcab',
                'cdab',
                'cadb',
                'cabd',
                'dacb',
                'adcb',
                'acdb',
                'acbd',
                'dabc',
                'adbc',
                'abdc',
                'abcd',
            ]),
        );

        expect(analysePlateau['genererAnagrames']('aabc')).to.deep.equal(
            new Set(['cbaa', 'bcaa', 'baca', 'baac', 'caba', 'acba', 'abca', 'abac', 'caab', 'acab', 'aacb', 'aabc']),
        );

        expect(analysePlateau['genererAnagrames']('aabb')).to.deep.equal(new Set(['bbaa', 'baba', 'baab', 'abba', 'abab', 'aabb']));
    });

    it('genererCombinaisons devrait retourner set vide si string vide', () => {
        analysePlateau['genererCombinaisons']('', '', 0);
        expect(analysePlateau['combinaison']).to.deep.equal(new Set());
    });

    it('genererCombinaisons devrait retourner les bons resultats avec une lettre', () => {
        analysePlateau['genererCombinaisons']('a', '', 0);
        expect(analysePlateau['combinaison']).to.deep.equal(new Set(['a']));
    });

    it('genererCombinaisons devrait retourner les bons resultats avec deux lettres', () => {
        analysePlateau['genererCombinaisons']('ab', '', 0);
        expect(analysePlateau['combinaison']).to.deep.equal(new Set(['a', 'ab', 'b']));
        analysePlateau['combinaison'] = new Set();
        analysePlateau['genererCombinaisons']('aa', '', 0);
        expect(analysePlateau['combinaison']).to.deep.equal(new Set(['a', 'aa']));
    });

    it('genererCombinaisons devrait retourner les bons resultats avec trois lettres', () => {
        analysePlateau['genererCombinaisons']('abc', '', 0);
        expect(analysePlateau['combinaison']).to.deep.equal(new Set(['a', 'ab', 'abc', 'ac', 'b', 'bc', 'c']));
        analysePlateau['combinaison'] = new Set();
        analysePlateau['genererCombinaisons']('abb', '', 0);
        expect(analysePlateau['combinaison']).to.deep.equal(new Set(['a', 'ab', 'abb', 'b', 'bb']));
    });

    it('genererCombinaisons devrait retourner les bons resultats avec quatres lettres', () => {
        analysePlateau['genererCombinaisons']('abcd', '', 0);
        expect(analysePlateau['combinaison']).to.deep.equal(
            new Set(['a', 'ab', 'abc', 'abcd', 'abd', 'ac', 'acd', 'ad', 'b', 'bc', 'bcd', 'bd', 'c', 'cd', 'd']),
        );
    });

    it('genererPermutations devrait retourner array vide si string vide', () => {
        analysePlateau['genererPermutations']('');
        expect(analysePlateau['combinaison']).to.deep.equal(new Set());
    });

    it('genererPermutations devrait retourner les bons resultats avec une lettre', () => {
        expect(analysePlateau['genererPermutations']('a')).to.deep.equal(['a']);
    });

    it('genererPermutations devrait retourner les bons resultats avec deux lettres', () => {
        expect(analysePlateau['genererPermutations']('ab')).to.deep.equal(['a', 'ba', 'ab', 'b']);
    });

    it('genererPermutations devrait retourner les bons resultats avec trois lettres', () => {
        expect(analysePlateau['genererPermutations']('abc')).to.deep.equal([
            'a',
            'ba',
            'ab',
            'cba',
            'bca',
            'bac',
            'cab',
            'acb',
            'abc',
            'ca',
            'ac',
            'b',
            'cb',
            'bc',
            'c',
        ]);
    });

    it('genererAnagrames devrait retourner le bon nombre de resultats avec 7 lettres', () => {
        const nombre = 5040; // 7!
        expect(analysePlateau['genererAnagrames']('1234567').size).to.equal(nombre);
    });

    it('verifier que le plateau est reference par les deux services', () => {
        placerLettres.interpreterCommande('test', { x: 7, y: 7 }, true);
        expect(analysePlateau['placerLettresService'].plateau[7][7].lettreContenue).to.deep.equal(new Lettre('t'));
    });

    it('verifier que trouverPlacementsValides marche avec peux de lettres', () => {
        const analyse = analysePlateau['trouverPlacementsValides']('el');
        expect(analyse).to.deep.equal([
            { lettres: 'le', coordonnee: { x: 6, y: 7 }, estHorizontal: true, score: 4 },
            { lettres: 'le', coordonnee: { x: 7, y: 6 }, estHorizontal: false, score: 4 },
            { lettres: 'le', coordonnee: { x: 7, y: 7 }, estHorizontal: true, score: 4 },
            { lettres: 'le', coordonnee: { x: 7, y: 7 }, estHorizontal: false, score: 4 },
        ]);
    });

    it('verifier que trouverPlacementsValides marche avec des lettres deja sur le plateau', (done: Mocha.Done) => {
        placerLettres.interpreterCommande('test', { x: 7, y: 7 }, true);
        placerLettres.finirTour();
        const analyse = analysePlateau['trouverPlacementsValides']('abcDeff');
        for (const resultat of analyse) {
            const placement = placerLettres.interpreterCommande(resultat.lettres, resultat.coordonnee, resultat.estHorizontal);
            expect(placement.succes && placement.score !== MOT_INVALIDE).to.equal(true);
            placerLettres.retirerLettres();
        }

        done();
    });

    it('verifier que trouverPlacementsValides marche avec plein de lettres', (done: Mocha.Done) => {
        const analyse = analysePlateau['trouverPlacementsValides']('abcDefg');
        for (const resultat of analyse) {
            const placement = placerLettres.interpreterCommande(resultat.lettres, resultat.coordonnee, resultat.estHorizontal);
            expect(placement.succes && placement.score !== MOT_INVALIDE).to.equal(true);
            placerLettres.retirerLettres();
        }

        done();
    });

    it('verifier que trouverCasesRemplies retourne les placements de cases deja remplies', () => {
        placerLettres.interpreterCommande('test', { x: 7, y: 7 }, true);
        analysePlateau['trouverCasesRemplies']();
        for (let i = 0; i < 4; i++) {
            expect(analysePlateau['casesRemplies'][7 + i][7])
                .to.equal(true)
                .and.to.be.a('boolean');
        }
        expect(analysePlateau['casesRemplies'][6][7]).to.equal(false).and.to.be.a('boolean');
        expect(analysePlateau['casesRemplies'][11][7]).to.equal(false).and.to.be.a('boolean');
    });

    it('verifier que analyserAvecChevalet retourne les bons placements', () => {
        placerLettres.joueur.chevalet.lettres = [new Lettre('e'), new Lettre('*'), new Lettre('l')];
        const analyse = analysePlateau.analyserAvecChevalet();
        expect(analyse).to.deep.equal([
            { lettres: 'le', coordonnee: { x: 6, y: 7 }, estHorizontal: true, score: 4 },
            { lettres: 'le', coordonnee: { x: 7, y: 6 }, estHorizontal: false, score: 4 },
            { lettres: 'le', coordonnee: { x: 7, y: 7 }, estHorizontal: true, score: 4 },
            { lettres: 'le', coordonnee: { x: 7, y: 7 }, estHorizontal: false, score: 4 },
        ]);
    });
});
