/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable dot-notation */
import { Joueur } from '@app/classes/joueur';
import { Lettre } from '@app/classes/lettre';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { CommandeService } from './commande.service';

describe('CommandeService', () => {
    let commandeService: CommandeService;
    const joueurTest = new Joueur('joueurTest', '');

    beforeEach(() => {
        commandeService = new CommandeService(joueurTest);
    });

    it('determinerCommande devrait appeler envoyerEchange si tel est le cas', () => {
        const spyEnvoyerEchange = sinon.spy(commandeService, <any>['envoyerEchange']);
        const commandeTest = {
            type: 'echanger',
            argument: 'abc',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        commandeService.determinerCommande(commandeTest);

        expect(spyEnvoyerEchange.calledOnce).to.equal(true);
        expect(spyEnvoyerEchange.calledWith(commandeTest)).to.equal(true);
    });

    it("determinerCommande devrait retourner le message d'erreur approprié si la commande est pas trouvee", () => {
        const commandeTest = {
            type: 'echangerr',
            argument: 'abc',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        const reponseTest = commandeService.determinerCommande(commandeTest).messageErreur;
        expect(reponseTest).to.equal("Cette commande n'existe pas!");
    });

    it('envoyerReserve devrait appeler getQteReserve', () => {
        const spyGetQteReserve = sinon.spy(commandeService.echangeLettreService, 'getQteReserve');
        const commandeTest = { type: 'reserve', argument: '', idJoueur: 'idJoueurPourTest5454511556', nomJoueur: 'nomTest', idPartie: 'partieTest' };
        commandeService.determinerCommande(commandeTest);

        expect(spyGetQteReserve.calledOnce).to.equal(true);
    });

    it('envoyerReserve devrait generer le bon message erreur si la syntaxe est invalide', () => {
        const commandeTest = { type: 'reserve', argument: 'e', idJoueur: 'idJoueurPourTest5454511556', nomJoueur: 'nomTest', idPartie: 'partieTest' };

        expect(commandeService.determinerCommande(commandeTest).messageErreur).to.equal(
            "Pour voir l'état de la réserve, écrivez simplement ceci: !reserve. Veuilez réessayer:",
        );
    });

    it('envoyerEchange devrait appeler echangerLettres avec les bonnes lettres', () => {
        const spyEchangerLettres = sinon.spy(commandeService.echangeLettreService, 'echangerLettres');
        const commandeTest = {
            type: 'echanger',
            argument: 'abc',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        commandeService.determinerCommande(commandeTest);

        expect(spyEchangerLettres.calledOnce).to.equal(true);
        expect(spyEchangerLettres.calledWith('abc')).to.equal(true);
    });

    it("envoyerEchange devrait retourner le message d'erreur approprié s'il y a un problème de syntaxe", () => {
        const commandeTest = {
            type: 'echanger',
            argument: 'qdghuqhduqwhu',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        const reponseTest = commandeService.determinerCommande(commandeTest).messageErreur;
        expect(reponseTest).to.equal("Erreur de syntaxe! Exemple d'échange valide -> !echanger abc.");
    });

    it("envoyerEchange devrait retourner le message d'erreur approprié si les caractères à échanger sont invalides", () => {
        const commandeTest = {
            type: 'echanger',
            argument: 'abC',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        const reponseTest = commandeService.determinerCommande(commandeTest).messageErreur;

        expect(reponseTest).to.equal('Les caractères que vous voulez échanger ne sont pas valides.');
    });

    it("envoyerIndice devrait retourner le message d'erreur approprié si on rajoute un argument inutile", () => {
        const commandeTest = {
            type: 'indice',
            argument: 'test',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        const reponseTest = commandeService.determinerCommande(commandeTest).messageErreur;
        expect(reponseTest).to.equal('Pour recevoir des indices, écrivez simplement ceci: !indice. Veuilez réessayer:');
    });

    it('envoyerIndice devrait appeler analyserAvecChevalet si bonne syntaxe', () => {
        const commandeTest = { type: 'indice', argument: '', idJoueur: 'idJoueurPourTest5454511556', nomJoueur: 'nomTest', idPartie: 'partieTest' };
        const spyAnalysePlateau = sinon.spy(commandeService.analysePlateauService, 'analyserAvecChevalet');
        commandeService.determinerCommande(commandeTest);
        expect(spyAnalysePlateau.calledOnce).to.equal(true);
    });

    it('envoyerIndice devrait retourner le bon message', () => {
        const commandeTest = { type: 'indice', argument: '', idJoueur: 'idJoueurPourTest5454511556', nomJoueur: 'nomTest', idPartie: 'partieTest' };
        const fausseAnalyse = [
            { lettres: 'test', coordonnee: { x: 0, y: 0 }, estHorizontal: true, score: 0 },
            { lettres: 't', coordonnee: { x: 7, y: 7 }, estHorizontal: true, score: 0 },
            { lettres: 'test', coordonnee: { x: 14, y: 14 }, estHorizontal: false, score: 0 },
        ];
        const stubAnalysePlateau = sinon.stub(commandeService.analysePlateauService, 'analyserAvecChevalet').callsFake(() => {
            return fausseAnalyse;
        });
        const reponseTest = commandeService.determinerCommande(commandeTest);
        expect(stubAnalysePlateau.calledOnce).to.equal(true);
        expect(reponseTest.resultat).to.equal(
            'Voici quelques placements possibles pour vous aider :) :\n' + '!placer a1h test\n' + '!placer h8 t\n' + '!placer o15v test\n',
        );
    });

    it('chaineContientLettres devrait retourner true si la chaine contient seulement des caracteres de alphabet', () => {
        // eslint-disable-next-line dot-notation
        expect(commandeService['chaineContientLettres']('abc*')).to.equal(true);
    });

    it('chaineContientLettres devrait retourner false si la chaine contient un caractere ne se trouvant pas dans alphabet', () => {
        // eslint-disable-next-line dot-notation
        expect(commandeService['chaineContientLettres']('aBc*')).to.equal(false);
    });

    it('determinerCommande devrait appeler envoyerPlacement si tel est le cas', () => {
        const spyEnvoyerEchange = sinon.spy(commandeService, <any>['envoyerPlacement']);
        const commandeTest = {
            type: 'placer',
            argument: 'g13h adan',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        commandeService.determinerCommande(commandeTest);

        expect(spyEnvoyerEchange.calledOnce).to.equal(true);
        expect(spyEnvoyerEchange.calledWith(commandeTest)).to.equal(true);
    });

    it("envoyerPlacement devrait retourner le message d'erreur approprié s'il y a un problème de syntaxe", () => {
        const commandeTest = { type: 'placer', argument: '  ', idJoueur: 'idJoueurPourTest5454511556', nomJoueur: 'nomTest', idPartie: 'partieTest' };
        const reponseTest = commandeService.determinerCommande(commandeTest).messageErreur;
        expect(reponseTest).to.equal('Erreur de syntaxe! Exemple de placement valide -> !placer g9h adant.');
    });

    it("envoyerPlacement devrait retourner le message d'erreur approprié s'il y a une coordonnee verticale invalide", () => {
        const commandeTest = {
            type: 'placer',
            argument: 'G13h adant',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        const reponseTest = commandeService.determinerCommande(commandeTest).messageErreur;

        expect(reponseTest).to.equal('Erreur de syntaxe! Les coordonnées doivent être dans le format [a-o][1-15][h ou v].');

        const commandeTest2 = {
            type: 'placer',
            argument: 'o13h a',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        const reponseTest4 = commandeService.determinerCommande(commandeTest2).messageErreur;

        expect(reponseTest4).to.not.equal(
            'Erreur de syntaxe! Les coordonnées doivent être dans le format ' +
                '[a-o][1-15][h ou v] (orientation optionnelle pour une seule lettre placée).',
        );
    });

    it("envoyerPlacement devrait retourner le message d'erreur approprié s'il y a une coordonnee horizontale invalide", () => {
        const commandeTest = {
            type: 'placer',
            argument: 'g0h a',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        const reponseTest = commandeService.determinerCommande(commandeTest);
        expect(reponseTest.messageErreur).to.equal(
            'Erreur de syntaxe! Les coordonnées doivent être dans le format ' +
                '[a-o][1-15][h ou v] (orientation optionnelle pour une seule lettre placée).',
        );
    });

    it("envoyerPlacement devrait retourner le message d'erreur approprié s'il y a une orientation invalide", () => {
        const commandeTest = {
            type: 'placer',
            argument: 'g130 a',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        const reponseTest = commandeService.determinerCommande(commandeTest).messageErreur;

        expect(reponseTest).to.equal(
            'Erreur de syntaxe! Les coordonnées doivent être dans le format ' +
                '[a-o][1-15][h ou v] (orientation optionnelle pour une seule lettre placée).',
        );
    });

    it('envoyerPlacement devrait prendre en compte le chevalet', () => {
        joueurTest.chevalet.lettres = [new Lettre('a'), new Lettre('b'), new Lettre('c'), new Lettre('*'), new Lettre('*')];
        const commandeTest = {
            type: 'placer',
            nomJoueur: 'nomTest',
            argument: 'h8h zut',
            idJoueur: 'idJoueurPourTest5454511556',
            idPartie: 'partieTest',
        };
        const reponseTest = commandeService.determinerCommande(commandeTest).messageErreur;
        expect(reponseTest).to.equal('Votre chevalet ne contient pas toutes les lettres que vous voulez placer.');

        const commandeTest2 = {
            type: 'placer',
            argument: 'h8h baSE',
            idJoueur: 'idJoueurPourTest5454511556',
            nomJoueur: 'nomTest',
            idPartie: 'partieTest',
        };
        const reponseTest2 = commandeService.determinerCommande(commandeTest2).messageErreur;
        expect(reponseTest2).to.equal('');
    });

    it('devrait extraire les bonne coordonnees a envoyer au placement de lettres a partir de celle entrees par le joueur', () => {
        expect(commandeService['extraireCoordonnees']('a1h', true)).to.deep.equal({ coordonnee: { x: 0, y: 0 }, estHorizontal: true });

        expect(commandeService['extraireCoordonnees']('g13v', true)).to.deep.equal({ coordonnee: { x: 12, y: 6 }, estHorizontal: false });

        expect(commandeService['extraireCoordonnees']('h15', false)).to.deep.equal({ coordonnee: { x: 14, y: 7 }, estHorizontal: true });
    });

    it('devrait donner la bonne commande a partir des coordonnes de l analyse', () => {
        expect(commandeService['convertirEnPlacement']('test', { x: 7, y: 7 }, true)).to.equal('!placer h8h test');
        expect(commandeService['convertirEnPlacement']('test', { x: 0, y: 1 }, false)).to.equal('!placer b1v test');
        expect(commandeService['convertirEnPlacement']('t', { x: 14, y: 14 }, true)).to.equal('!placer o15 t');
    });

    it('chevaletALettres doit retourner la bonne reponse', () => {
        joueurTest.chevalet.lettres = [new Lettre('a'), new Lettre('b'), new Lettre('c'), new Lettre('*'), new Lettre('*')];
        expect(commandeService['chevaletALettres']('bca')).to.equal(true);
        expect(commandeService['chevaletALettres']('bcA')).to.equal(true);
        expect(commandeService['chevaletALettres']('bcAZ')).to.equal(true);
        expect(commandeService['chevaletALettres']('bcAz')).to.equal(false);
        expect(commandeService['chevaletALettres']('bbc')).to.equal(false);
        expect(commandeService['chevaletALettres']('abcDEF')).to.equal(false);
    });
});
