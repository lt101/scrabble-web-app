import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PointEntreeServiceService } from '@app/services/point-entree-service.service';

@Component({
    selector: 'app-game-mode',
    templateUrl: './game-mode.component.html',
    styleUrls: ['./game-mode.component.scss'],
})
export class GameModeComponent implements OnInit {
    isClassiqueMode: boolean;
    isLog2990Mode: boolean;

    constructor(public dialog: MatDialog, private pointEntree: PointEntreeServiceService) {}

    ngOnInit(): void {
        this.isClassiqueMode = this.pointEntree.isClassiqueMode;
        this.isLog2990Mode = this.pointEntree.isLog2990Mode;
    }

    onChange(i: number) {
        if (i === 0) {
            this.pointEntree.activerClassiqueMode();
            this.isClassiqueMode = this.pointEntree.isClassiqueMode;
            this.pointEntree.changerMode();
        } else {
            this.pointEntree.activerLog2990Mode();
            this.isLog2990Mode = this.pointEntree.isLog2990Mode;
            this.pointEntree.changerMode();
        }
    }
}
