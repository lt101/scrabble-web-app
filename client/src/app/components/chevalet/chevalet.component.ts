import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import { MAXLETTRES } from '@app/classes/chevalet';
import { PAS_SELECT } from '@app/constantes/chevalet.service.constantes';
import { ChevaletService } from '@app/services/chevalet.service';
import { SourisService } from '@app/services/souris.service';

@Component({
    selector: 'app-chavalet',
    templateUrl: './chevalet.component.html',
    styleUrls: ['./chevalet.component.scss'],
})
export class ChevaletComponent implements AfterViewInit {
    @ViewChildren('lettre') private lettres: QueryList<ElementRef>;
    nLettres: number[];

    constructor(private chevaletService: ChevaletService, private sourisService: SourisService) {
        this.nLettres = Array(MAXLETTRES)
            .fill(0)
            .map((x, i) => i);
    }

    @HostListener('wheel', ['$event'])
    wheelScrollLettre($event: WheelEvent): void {
        switch (true) {
            case $event.deltaY > 0:
                this.chevaletService.deplacerLettre(false);
                break;

            case $event.deltaY < 0:
                this.chevaletService.deplacerLettre(true);
                break;

            default:
                break;
        }
    }

    @HostListener('keydown', ['$event'])
    reconnaitreTouche($event: KeyboardEvent): void {
        switch ($event.key) {
            case 'ArrowLeft':
                this.chevaletService.deplacerLettre(true);
                break;

            case 'ArrowRight':
                this.chevaletService.deplacerLettre(false);
                break;

            default:
                this.sourisService.detecterBoutton($event);
                this.chevaletService.selectionnerClavier(this.sourisService.bouttonPresser);
                break;
        }
    }

    ngAfterViewInit(): void {
        this.chevaletService.lettres = this.lettres;
    }

    estSelectionEchange(index: number): boolean {
        return this.chevaletService.estSelectionEchange(index);
    }

    estSelectManip(index: number): boolean {
        return this.chevaletService.selectManip === index;
    }

    selectionnerEchange($event: Event, index: number) {
        this.chevaletService.selectionnerEchange($event, index);
    }

    selectionnerManip(index: number) {
        this.chevaletService.selectionnerManip(index);
    }

    focusOut($event: FocusEvent) {
        if ($event.relatedTarget) {
            if (($event.relatedTarget as HTMLElement).id !== 'bouton-echange') {
                this.annulerEchange();
            }
        } else this.annulerEchange();
    }

    private annulerEchange() {
        this.chevaletService.selectEchange = [];
        this.chevaletService.selectManip = PAS_SELECT;
    }
}
