/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Chevalet } from '@app/classes/chevalet';
import { Joueur } from '@app/classes/joueur';
import { MIN_LETTRES_ECHANGE_RESERVE, NOMBRE_LETTRES_INITIALES } from '@app/classes/reserve';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { EchangeLettreService } from './echange-lettres.service';

describe('EchangeLettreService', () => {
    let service: EchangeLettreService;
    const joueur = new Joueur('joueurTest', '');

    beforeEach(() => {
        joueur.chevalet = new Chevalet();
        joueur.chevalet.ajouterLettre('b');
        joueur.chevalet.ajouterLettre('o');
        joueur.chevalet.ajouterLettre('n');
        joueur.chevalet.ajouterLettre('j');
        joueur.chevalet.ajouterLettre('*');
        joueur.chevalet.ajouterLettre('u');
        joueur.chevalet.ajouterLettre('r');
        service = new EchangeLettreService(joueur);
    });

    it('chevaletEstValide retourne true si les lettres a echanger se trouvent dans le chevalet', () => {
        expect(service['chevaletEstValide']('o*')).to.equal(true);
    });

    it('chevaletEstValide retourne false si les lettres a echanger ne se trouvent pas dans le chevalet', () => {
        expect(service['chevaletEstValide']('r2')).to.equal(false);
    });

    it('chevaletEstValide retourne false trop de lettres a echanger', () => {
        expect(service['chevaletEstValide']('vivelestests')).to.equal(false);
    });

    it('echangeEstPossible appelle assezDeLettres et chevaletEstValide', () => {
        const spyAssezDeLettres = sinon.spy(service.reserve, 'assezDeLettres');
        const spyChevaletEstValide = sinon.spy(service, <any>['chevaletEstValide']);
        service['echangeEstPossible']('bon');

        expect(spyAssezDeLettres.calledOnce).to.equal(true);
        expect(spyChevaletEstValide.calledOnce).to.equal(true);
    });

    it('echangeEstPossible retourne true si le chevalet et la reserve le permettent', () => {
        sinon.stub(service.reserve, 'assezDeLettres').returns(true);
        sinon.stub(service, <any>['chevaletEstValide']).returns(true);

        expect(service['echangeEstPossible']('bon')).to.equal(true);
    });

    it('echangeEstPossible retourne false si le chevalet ou la reserve ne le permet pas', () => {
        sinon.stub(service.reserve, 'assezDeLettres').returns(true);
        sinon.stub(service, <any>['chevaletEstValide']).returns(false);

        expect(service['echangeEstPossible']('bon')).to.equal(false);
    });

    it("echangerLettres ne change pas le nombre de lettres dans reserve et chevalet si l'échange a été réalisé avec succès", () => {
        expect(service.echangerLettres('j*ur').succes).to.equal(true);
        expect(service.reserve.reserveLettres.length).to.equal(NOMBRE_LETTRES_INITIALES);
        expect(service.joueur.chevalet.nombreDeLettres()).to.equal(MIN_LETTRES_ECHANGE_RESERVE);
    });

    it('echangerLettres retourne le message approprié si echange est pas possible', () => {
        expect(service.echangerLettres('a').messageErreur).to.equal('La commande est impossible à réaliser. Vérifier votre chevalet et la réserve.');
    });
});
