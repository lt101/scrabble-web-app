/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { RESERVEINITIALE } from '@app/constantes/reserve-initial';
import { expect } from 'chai';
import { ALPHABET, NOMBRE_LETTRES_INITIALES, Reserve } from './reserve';

describe('Reserve', () => {
    let reserve: Reserve;

    beforeEach(() => {
        reserve = new Reserve();
    });

    it('initialisationReserve contient 102 lettres', () => {
        expect(reserve.reserveLettres.length).to.equal(NOMBRE_LETTRES_INITIALES);
    });

    it('assezDeLettres retourne true lorsque la reserve a assez de lettres', () => {
        expect(reserve.assezDeLettres()).to.equal(true);
    });

    it('assezDeLettres retourne false si pas assez de lettres dans la reserve', () => {
        reserve.reserveLettres = [];

        expect(reserve.assezDeLettres()).to.equal(false);
    });

    it('piger diminue le nombre de lettres dans la reserve', () => {
        const nombreLettresAttendu = 101;

        const pige = reserve.piger(1);
        expect(reserve.reserveLettres.length).to.be.equal(nombreLettresAttendu);
        const qte = RESERVEINITIALE.get(pige);
        if (qte) expect(reserve['qteLettres'].get(pige)).to.be.equal(qte - 1);
    });

    it('piger ne diminue pas le nombre de lettres dans la reserve quand on demande trop de lettres', () => {
        const nombreLettresAttendu = 102;
        const nLettres = 103;
        reserve.piger(nLettres);
        let qte;
        expect(reserve.reserveLettres.length).to.be.equal(nombreLettresAttendu);
        for (const lettre of ALPHABET) {
            if ((qte = RESERVEINITIALE.get(lettre))) expect(reserve['qteLettres'].get(lettre)).to.be.equal(qte);
        }
    });

    it('piger ne diminue pas le nombre de lettres dans la reserve quand on demande trop de lettres', () => {
        const nombreLettresAttendu = 102;
        const nLettres = 8;
        reserve.piger(nLettres);
        let qte;
        expect(reserve.reserveLettres.length).to.be.equal(nombreLettresAttendu);
        for (const lettre of ALPHABET) {
            if ((qte = RESERVEINITIALE.get(lettre))) expect(reserve['qteLettres'].get(lettre)).to.be.equal(qte);
        }
    });

    it('piger retourne un string vide quand pas assez de lettres ', () => {
        reserve.reserveLettres = [];
        const resultat = reserve.piger(1);
        expect(resultat).to.be.equal('');
    });

    it('indexAleatoire retourne un number', () => {
        expect(reserve['indexAleatoire']()).to.be.a('number');
    });

    it('remettre augmente le nombre de lettres dans la reserve', () => {
        reserve.reserveLettres = ['a'];

        const nombreLettresAttendu = 2;

        reserve.remettre('b');

        expect(reserve.reserveLettres.length).to.be.equal(nombreLettresAttendu);
        // eslint-disable-next-line dot-notation
        let qte;
        if ((qte = RESERVEINITIALE.get('b'))) expect(reserve['qteLettres'].get('b')).to.be.equal(qte + 1);
    });

    it('remettre augmente pas le nombre de lettres dans la reserve quand reserve pleine', () => {
        const nombreLettresAttendu = 102;

        reserve.remettre('a');

        expect(reserve.reserveLettres.length).to.be.equal(nombreLettresAttendu);
    });

    it('piger update qteLettres', () => {
        const pige = reserve.piger(7);
        const lettresPigees = new Map<string, number>();
        for (const lettre of pige) {
            lettresPigees[lettre] = 0;
        }
        for (const lettre of pige) {
            lettresPigees[lettre]++;
        }
        let qte;
        lettresPigees.forEach((value, key) => {
            qte = RESERVEINITIALE.get(key);
            if (qte) expect(reserve['qteLettres'].get(key)).to.be.equal(qte - value);
        });
    });

    it('remettre update qteLettres', () => {
        reserve.reserveLettres = [];
        reserve.remettre('bbbbb');
        // eslint-disable-next-line dot-notation
        const qte = RESERVEINITIALE.get('b');
        if (qte) expect(reserve['qteLettres'].get('b')).to.be.equal(qte + 5);
    });

    it('actualiserQteLettres update qteLettre', () => {
        reserve['actualiserQteLettres']('b', '+');
        const qte = RESERVEINITIALE.get('b');
        if (qte) expect(reserve['qteLettres'].get('b')).to.be.equal(qte + 1);
    });

    it("actualiserQteLettres retourne false si l'opérateur est invalide", () => {
        expect(reserve['actualiserQteLettres']('b', '0')).to.be.equal(false);
    });

    it('getReserveString retourne la reserve en string', () => {
        const reserveString = reserve.getReserveString();
        expect(reserveString).to.be.equal(
            // eslint-disable-next-line max-len
            'a : 9\nb : 2\nc : 2\nd : 3\ne : 15\nf : 2\ng : 2\nh : 2\ni : 8\nj : 1\nk : 1\nl : 5\nm : 3\nn : 6\no : 6\np : 2\nq : 1\nr : 6\ns : 6\nt : 6\nu : 6\nv : 2\nw : 1\nx : 1\ny : 1\nz : 1\n* : 2\n',
        );
    });
});
