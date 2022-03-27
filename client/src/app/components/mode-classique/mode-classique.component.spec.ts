import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointEntreeServiceService } from '@app/services/point-entree-service.service';
import { ModeClassiqueComponent } from './mode-classique.component';
import SpyObj = jasmine.SpyObj;

describe('ModeClassiqueComponent', () => {
    let component: ModeClassiqueComponent;
    let fixture: ComponentFixture<ModeClassiqueComponent>;
    let pointEntreeSpy: SpyObj<PointEntreeServiceService>;

    beforeEach(() => {
        pointEntreeSpy = jasmine.createSpyObj('PointEntreeServiceService', [
            'activerSoloOption',
            'activerCreerOption',
            'activerJoidreOption',
            'changerOption',
        ]);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModeClassiqueComponent],
            providers: [{ provide: PointEntreeServiceService, useValue: pointEntreeSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModeClassiqueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onChange should change options correctly', () => {
        component.onChange(0);
        expect(pointEntreeSpy.activerSoloOption).toHaveBeenCalled();
        expect(pointEntreeSpy.changerOption).toHaveBeenCalled();
        component.onChange(1);
        expect(pointEntreeSpy.activerSoloOption).toHaveBeenCalled();
        expect(pointEntreeSpy.changerOption).toHaveBeenCalled();
        component.onChange(2);
        expect(pointEntreeSpy.activerJoidreOption).toHaveBeenCalled();
        expect(pointEntreeSpy.changerOption).toHaveBeenCalled();
    });
});
