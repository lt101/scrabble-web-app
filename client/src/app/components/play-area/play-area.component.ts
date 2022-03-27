import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HAUTEUR_DEFAUT, LARGEUR_DEFAUT, NB_CASES, POSITIONS } from '@app/constantes/play-area.constantes';
import { PlacementManuelService } from '@app/services/placement-manuel.service';
import { SourisService } from '@app/services/souris.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChildren('tuile') private tuilesHtml: QueryList<ElementRef>;
    positions: { horizontal: string[]; vertical: string[] };
    estVisible: boolean[][];
    private canvasSize: { x: number; y: number };

    constructor(private sourisService: SourisService, private placementManuelService: PlacementManuelService) {
        this.estVisible = Array<boolean[]>(NB_CASES);
        for (let i = 0; i < this.estVisible.length; i++) {
            this.estVisible[i] = Array<boolean>(NB_CASES).fill(false);
        }
        this.positions = POSITIONS;
        this.canvasSize = { x: LARGEUR_DEFAUT, y: HAUTEUR_DEFAUT };
    }

    @HostListener('keydown', ['$event'])
    reconnaitreTouche($event: KeyboardEvent): void {
        this.sourisService.detecterBoutton($event);
        switch ($event.key) {
            case 'Backspace':
                this.placementManuelService.retirerLettre();
                break;
            case 'Enter':
                this.placementManuelService.envoyerCommande();
                break;
            case 'Escape':
                this.placementManuelService.reinitialiserPlacement();
                break;
            case 'Shift':
                break;
            case 'CapsLock':
                break;
            default:
                this.placementManuelService.placerLettre(this.sourisService.bouttonPresser);
                break;
        }
    }

    ngAfterViewInit(): void {
        this.placementManuelService.initialiserTableau(this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D, this.tuilesHtml);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    cliqueSouris(event: MouseEvent): void {
        this.sourisService.detecterCliqueSouris(event);
        const coor = {
            x: Math.floor((this.sourisService.x * NB_CASES) / this.canvasSize.x),
            y: Math.floor((this.sourisService.y * NB_CASES) / this.canvasSize.y),
        };
        this.placementManuelService.selectionnerCase(coor.x, coor.y);
    }
}
