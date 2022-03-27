import { Component } from '@angular/core';
import { PointEntreeServiceService } from '@app/services/point-entree-service.service';

@Component({
    selector: 'app-mode-classique',
    templateUrl: './mode-classique.component.html',
    styleUrls: ['./mode-classique.component.scss'],
})
export class ModeClassiqueComponent {
    constructor(private pointEntree: PointEntreeServiceService) {}
    onChange(i: number): void {
        if (i === 0) {
            this.pointEntree.activerSoloOption();
            this.pointEntree.changerOption();
            return;
        }
        if (i === 1) {
            this.pointEntree.activerCreerOption();
            this.pointEntree.changerOption();
            return;
        }
        this.pointEntree.activerJoidreOption();
        this.pointEntree.changerOption();
    }
}
