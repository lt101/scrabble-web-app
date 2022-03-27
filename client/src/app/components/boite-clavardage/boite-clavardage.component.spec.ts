import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClavardageService } from '@app/services/clavardage.service';
import { GestionnaireDeCommandeService } from '@app/services/gestionnaire-de-commande.service';
import { BoiteClavardageComponent } from './boite-clavardage.component';
import SpyObj = jasmine.SpyObj;

describe('BoiteClavardageComponent', () => {
    let serviceClavardageSpy: SpyObj<ClavardageService>;
    let serviceCommandeSpy: SpyObj<GestionnaireDeCommandeService>;
    let boiteClavardageSpy: SpyObj<BoiteClavardageComponent>;
    let component: BoiteClavardageComponent;
    let fixture: ComponentFixture<BoiteClavardageComponent>;

    beforeEach(() => {
        serviceClavardageSpy = jasmine.createSpyObj('ClavardageService', ['envoyerMessage']);
        serviceCommandeSpy = jasmine.createSpyObj('GestionnaireDeCommandeService', ['envoyerCommande']);
        boiteClavardageSpy = jasmine.createSpyObj('GestionnaireDeSocketService', ['getMessages']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BoiteClavardageComponent],
            providers: [
                { provide: ClavardageService, useValue: serviceClavardageSpy },
                { provide: BoiteClavardageComponent, useValue: boiteClavardageSpy },
                { provide: GestionnaireDeCommandeService, useValue: serviceCommandeSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BoiteClavardageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('devrait être créé', () => {
        expect(component).toBeTruthy();
    });

    it('devrait appeler envoyerMessage() du service', () => {
        component.message = 'un message de test';
        component.envoyerMessage();
        expect(serviceClavardageSpy.envoyerMessage).toHaveBeenCalled();
    });

    it('devrait appeler envoyerCommande() du service', () => {
        component.message = '!placer h8h test';
        component.envoyerMessage();
        expect(serviceCommandeSpy.envoyerCommande).toHaveBeenCalled();
    });
    it("devrait reconnaitre l'origine d'un message", () => {
        component.ngOnInit();
        expect(component.wClavardages[0].auteur).toContain('Sys');
        expect(component.wClavardages[0].message).toContain('Bonjour');
    });
    it('devrait appeler toucheEnterPresser() du service pour message', () => {
        component.message = 'un message de test';
        const mockEvent: Event = new MouseEvent('click');
        component.toucheEnterPresser(mockEvent);
        expect(serviceClavardageSpy.envoyerMessage).toHaveBeenCalled();
    });

    it('devrait appeler toucheEnterPresser() du service pour commande', () => {
        component.message = '!placer h8h test';
        const mockEvent: Event = new MouseEvent('click');
        component.toucheEnterPresser(mockEvent);
        expect(serviceCommandeSpy.envoyerCommande).toHaveBeenCalled();
    });
});
