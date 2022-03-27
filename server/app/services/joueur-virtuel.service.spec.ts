/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Chevalet } from '@app/classes/chevalet';
import { Joueur } from '@app/classes/joueur';
import { Placement } from '@app/interfaces/placement';
import { expect } from 'chai';
import { beforeEach, describe } from 'mocha';
import * as sinon from 'sinon';
import { JoueurVirtuelService } from './joueur-virtuel.service';

describe('JoueurVirtuelService', () => {
    let service: JoueurVirtuelService;
    let stubRandom: sinon.SinonStub<[], number>;

    beforeEach(() => {
        service = new JoueurVirtuelService();
        stubRandom = sinon.stub(Math, 'random');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('echangeJV devrait retourner des lettres du joueur virtuel', () => {
        const joueurVirtuel = new Joueur('Hombre', 'JoueurVirtuel');
        joueurVirtuel.chevalet = new Chevalet();
        joueurVirtuel.chevalet.ajouterLettre('a');
        joueurVirtuel.chevalet.ajouterLettre('b');
        joueurVirtuel.chevalet.ajouterLettre('c');
        joueurVirtuel.chevalet.ajouterLettre('d');
        joueurVirtuel.chevalet.ajouterLettre('e');
        joueurVirtuel.chevalet.ajouterLettre('f');
        joueurVirtuel.chevalet.ajouterLettre('g');

        const lettresEchange = service.echangeJV(joueurVirtuel);
        for (const lettre of lettresEchange) {
            expect('abcdefg').to.contain(lettre);
        }
    });

    it('placementJV devrait generer un placement valide', () => {
        const placements = [
            { lettres: 'bogue', coordonnee: { x: 2, y: 4 }, estHorizontal: true, score: 4 },
            { lettres: 'assurance', coordonnee: { x: 5, y: 7 }, estHorizontal: true, score: 8 },
            { lettres: 'qualite', coordonnee: { x: 6, y: 4 }, estHorizontal: false, score: 17 },
        ];
        stubRandom.returns(0.4);
        const argument = service.placementJV(placements);
        expect(argument.split(' ')[1]).to.eq('bogue');
    });

    it('placementJV devrait generer un placement valide', () => {
        const placements = [
            { lettres: 'bogue', coordonnee: { x: 2, y: 4 }, estHorizontal: true, score: 4 },
            { lettres: 'assurance', coordonnee: { x: 5, y: 7 }, estHorizontal: true, score: 8 },
            { lettres: 'qualite', coordonnee: { x: 6, y: 4 }, estHorizontal: false, score: 17 },
        ];
        stubRandom.returns(0.5);
        const argument = service.placementJV(placements);
        expect(argument.split(' ')[1]).to.eq('assurance');
    });

    it('placementJV devrait generer un placement valide', () => {
        const placements = [
            { lettres: 'bogue', coordonnee: { x: 2, y: 4 }, estHorizontal: true, score: 4 },
            { lettres: 'assurance', coordonnee: { x: 5, y: 7 }, estHorizontal: true, score: 8 },
            { lettres: 'qualite', coordonnee: { x: 6, y: 4 }, estHorizontal: false, score: 17 },
        ];
        stubRandom.returns(0.9);
        const argument = service.placementJV(placements);
        expect(argument.split(' ')[1]).to.eq('qualite');
    });

    it('placementJV devrait generer un placement valide', () => {
        const placements = [
            { lettres: 'assurance', coordonnee: { x: 5, y: 7 }, estHorizontal: true, score: 8 },
            { lettres: 'qualite', coordonnee: { x: 6, y: 4 }, estHorizontal: false, score: 17 },
        ];
        stubRandom.returns(0.4);
        expect(service.placementJV(placements)).to.equal('');
    });

    it('placementJV devrait retourner un argument vide si aucun placement donne en parametre', () => {
        const placement: Placement[] = [];
        expect(service.placementJV(placement)).to.equal('');
    });
});
