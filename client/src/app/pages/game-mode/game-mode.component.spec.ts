// import { By } from '@angular/platform-browser';

// describe('GameModeComponent', () => {
//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should click Scrabble Classique button to set isClassiqueMode to true', async () => {
//         const buttonElement = fixture.debugElement.query(By.css('.classique'));

//         buttonElement.triggerEventHandler('click', null);

//         fixture.whenStable().then(() => {
//             expect(component.isClassiqueMode).toBe(true);
//             expect(component.isLog2990Mode).toBe(false);
//         });
//     });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { PointEntreeServiceService } from '@app/services/point-entree-service.service';
import { GameModeComponent } from './game-mode.component';
import SpyObj = jasmine.SpyObj;

export class MatDialogMock {
    open() {
        return true;
    }
}

describe('GameModeComponent', () => {
    let component: GameModeComponent;
    let fixture: ComponentFixture<GameModeComponent>;
    let pointEntreeSpy: SpyObj<PointEntreeServiceService>;

    beforeEach(() => {
        pointEntreeSpy = jasmine.createSpyObj('PointEntreeServiceService', ['activerClassiqueMode', 'activerLog2990Mode', 'changerMode']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [GameModeComponent],
            providers: [
                { provide: PointEntreeServiceService, useValue: pointEntreeSpy },
                { provide: MatDialog, useClass: MatDialogMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameModeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should initialize the correct game mode', () => {
        pointEntreeSpy.isClassiqueMode = true;
        pointEntreeSpy.isLog2990Mode = false;
        component.ngOnInit();
        expect(component.isClassiqueMode).toBe(true);
        expect(component.isLog2990Mode).toBe(false);
    });

    it('onChange should change options correctly', () => {
        component.onChange(0);
        expect(pointEntreeSpy.activerClassiqueMode).toHaveBeenCalled();
        expect(pointEntreeSpy.changerMode).toHaveBeenCalled();

        component.onChange(1);
        expect(pointEntreeSpy.activerLog2990Mode).toHaveBeenCalled();
        expect(pointEntreeSpy.changerMode).toHaveBeenCalled();
    });

    it('ouvrirScores devrait appeler open() de dialog', () => {
        const spyDialog = spyOn(component.dialog, 'open');
        component.ouvrirScores();
        expect(spyDialog).toHaveBeenCalled();
    });
});
