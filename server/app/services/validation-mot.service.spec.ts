/* eslint-disable dot-notation */
import { Mot } from '@app/classes/mot';
import { ValidationMotService } from '@app/services/validation-mot.service';
import { expect } from 'chai';

describe('Validation Mot Service', () => {
    const exempleBase = new Mot('exemple');
    const exempleVide = new Mot('');
    const serviceValidation = new ValidationMotService();

    it('devrait retourner une string a partir du constructeur de la classe mot', (done: Mocha.Done) => {
        expect(exempleBase.extraireString()).to.be.a('string').and.to.equals('exemple');

        expect(exempleVide.extraireString()).to.be.a('string').and.to.equals('');
        const exempleComplexe = new Mot('Le bon sens est la chose au monde la mieux partagee : car chacun pense en etre bien pourvu.');
        expect(exempleComplexe.extraireString())
            .to.be.a('string')
            .and.to.equals('Le bon sens est la chose au monde la mieux partagee : car chacun pense en etre bien pourvu.');
        done();
    });

    it('verifie que la longueur du mot et superieure ou egale a 2', (done: Mocha.Done) => {
        serviceValidation['changerMot'](exempleBase);
        expect(serviceValidation['tailleSupADeux']()).to.be.a('boolean').and.to.equals(true);

        serviceValidation['changerMot'](exempleVide);
        expect(serviceValidation['tailleSupADeux']()).to.be.a('boolean').and.to.equals(false);

        serviceValidation['changerMot'](new Mot('a'));
        expect(serviceValidation['tailleSupADeux']()).to.be.a('boolean').and.to.equals(false);

        serviceValidation['changerMot'](new Mot('un'));
        expect(serviceValidation['tailleSupADeux']()).to.be.a('boolean').and.to.equals(true);

        serviceValidation['changerMot'](new Mot('oui'));
        expect(serviceValidation['tailleSupADeux']()).to.be.a('boolean').and.to.equals(true);

        done();
    });

    it('ignore les accents, cedilles, et tremas', (done: Mocha.Done) => {
        expect(exempleBase.extraireString()).to.be.a('string').and.to.equals('exemple');

        expect(exempleVide.extraireString()).to.be.a('string').and.to.equals('');

        const exempleDiacritique = new Mot('éèêïç');
        expect(exempleDiacritique.extraireString()).to.be.a('string').and.to.equals('eeeic');

        const exempleEldritch = new Mot('c̴͎̍͠h̷̛̪͈ț̶̻͆̽ḩ̷͎̭͂͋ụ̵̡̟́̽l̶̛̙̩̅h̷̤͔̐û̵̡̗̦');
        expect(exempleEldritch.extraireString()).to.be.a('string').and.to.equals('chthulhu');

        const exemplePhrase = new Mot('Ça a chaufé');
        expect(exemplePhrase.extraireString()).to.be.a('string').and.to.equals('Ca a chaufe');

        done();
    });

    it("ne valide pas si trait d'union ou apostrophe", (done: Mocha.Done) => {
        serviceValidation['changerMot'](exempleBase);
        expect(serviceValidation['contientApostropheEtTrait']()).to.be.a('boolean').and.to.equals(false);

        serviceValidation['changerMot'](exempleVide);
        expect(serviceValidation['contientApostropheEtTrait']()).to.be.a('boolean').and.to.equals(false);

        serviceValidation['changerMot'](new Mot('jean-claude'));
        expect(serviceValidation['contientApostropheEtTrait']()).to.be.a('boolean').and.to.equals(true);

        serviceValidation['changerMot'](new Mot("aujourd'hui"));
        expect(serviceValidation['contientApostropheEtTrait']()).to.be.a('boolean').and.to.equals(true);

        serviceValidation['changerMot'](new Mot("s'crab-ble"));
        expect(serviceValidation['contientApostropheEtTrait']()).to.be.a('boolean').and.to.equals(true);

        done();
    });

    it('verifie que le dictionnaire est bien charge', (done: Mocha.Done) => {
        const iterateur = serviceValidation.dictionnaire.values();
        expect(iterateur.next().value).to.be.a('string').and.to.equals('aa');
        expect(iterateur.next().value).to.be.a('string').and.to.equals('aalenien');
        done();
    });

    it('verifie que le mot appartient au dictionnaire', (done: Mocha.Done) => {
        serviceValidation['changerMot'](exempleBase);
        expect(serviceValidation['appartientAuDictionnaire']()).to.be.a('boolean').and.to.equals(true);

        serviceValidation['changerMot'](exempleVide);
        expect(serviceValidation['appartientAuDictionnaire']()).to.be.a('boolean').and.to.equals(false);

        serviceValidation['changerMot'](new Mot('zygophyllacees'));
        expect(serviceValidation['appartientAuDictionnaire']()).to.be.a('boolean').and.to.equals(true);

        serviceValidation['changerMot'](new Mot('false'));
        expect(serviceValidation['appartientAuDictionnaire']()).to.be.a('boolean').and.to.equals(false);

        serviceValidation['changerMot'](new Mot('je pense que ca ne devrait pas marcher'));
        expect(serviceValidation['appartientAuDictionnaire']()).to.be.a('boolean').and.to.equals(false);

        serviceValidation['changerMot'](new Mot('BlAnChE'));
        expect(serviceValidation['appartientAuDictionnaire']()).to.be.a('boolean').and.to.equals(true);

        done();
    });

    it('verifie la validation complete du mot', (done: Mocha.Done) => {
        expect(serviceValidation.validation(exempleBase)).to.be.a('boolean').and.to.equals(true);

        expect(serviceValidation.validation(exempleVide)).to.be.a('boolean').and.to.equals(false);

        expect(serviceValidation.validation(new Mot('électRicité')))
            .to.be.a('boolean')
            .and.to.equals(true);

        expect(serviceValidation.validation(new Mot('monte-charge')))
            .to.be.a('boolean')
            .and.to.equals(false);

        expect(serviceValidation.validation(new Mot('a')))
            .to.be.a('boolean')
            .and.to.equals(false);

        done();
    });
});
