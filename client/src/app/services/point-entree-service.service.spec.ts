import { TestBed } from '@angular/core/testing';
import { Mode } from '@app/interfaces/mode';
import { Option } from '@app/interfaces/option';
import { configuration, PointEntreeServiceService } from '@app/services/point-entree-service.service';

describe('PointEntreeServiceService', () => {
    let service: PointEntreeServiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PointEntreeServiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('activerClassiqueMode should set the isClassiqueMode to true', () => {
        service.activerClassiqueMode();
        expect(service.isClassiqueMode).toBe(true);
    });

    it('activerLog2990Mode should set the isLog2990Mode to true', () => {
        service.activerClassiqueMode();
        expect(service.isClassiqueMode).toBe(true);
    });

    it('activerSoloOption should set the isSoloOption to true', () => {
        service.activerSoloOption();
        expect(service.isSoloOption).toBe(true);
    });

    it('activerCreerOption should set the isCreerOption to true', () => {
        service.activerCreerOption();
        expect(service.isCreerOption).toBe(true);
    });

    it('activerJoidreOption should set the isJoindreOption to true', () => {
        service.activerJoidreOption();
        expect(service.isJoindreOption).toBe(true);
    });

    it('reinitialiserConfiguration should set the configuration value the empty', () => {
        service.reinitialiserConfiguration();
        expect(configuration.mode).toEqual('');
        expect(configuration.option).toEqual('');
    });

    it('setMode should set the attribute mode value of configuration Objet to de new value ', () => {
        service.setMode(Mode.CLASSIQUE);
        expect(configuration.mode).toBe(Mode.CLASSIQUE);
        service.setMode(Mode.LOG2990);
        expect(configuration.mode).toBe(Mode.LOG2990);
    });

    it('changerOption should set the attribute option value of configuration Objet to the new value ', () => {
        service.activerSoloOption();
        service.changerOption();
        expect(configuration.option).toBe(Option.SOLO);
        service.activerCreerOption();
        service.changerOption();
        expect(configuration.option).toBe(Option.CREER);
        service.activerJoidreOption();
        service.changerOption();
        expect(configuration.option).toBe(Option.JOINDRE);
    });

    it('changerMode should set the attribute mode value of configuration Objet to classique if isClassiqueMode is true', () => {
        service.reinitialiserConfiguration();
        service.activerClassiqueMode();
        service.changerMode();
        expect(configuration.mode).toBe(Mode.CLASSIQUE);
        service.activerLog2990Mode();
        service.changerMode();
        expect(configuration.mode).toBe(Mode.LOG2990);
    });

    it('Spy should change what is called when wrapper function is called ', () => {
        // eslint-disable-next-line no-unused-vars
        const fakeSetMode = (x: string) => {
            //
        };
        const spy = spyOn(service, 'setMode').and.callFake(fakeSetMode);
        service.changerMode();
        expect(spy).toHaveBeenCalled();
    });
});
