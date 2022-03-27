import { Injectable } from '@angular/core';
import { Coordonnee } from '@app/interfaces/coordonnee';
import { Subject } from 'rxjs';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Injectable({
    providedIn: 'root',
})
export class SourisService {
    bouttonPresser: string;
    private positionSouris: Coordonnee;
    private sujetKeyboard: Subject<string>;

    constructor() {
        this.sujetKeyboard = new Subject<string>();
        this.positionSouris = { x: 0, y: 0 };
        this.bouttonPresser = '';
    }

    detecterBoutton(event: KeyboardEvent) {
        this.bouttonPresser = event.key;
        this.sujetKeyboard.next(this.bouttonPresser);
    }

    detecterCliqueSouris(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.positionSouris = { x: event.offsetX, y: event.offsetY };
        }
    }

    get x(): number {
        return this.positionSouris.x;
    }

    get y(): number {
        return this.positionSouris.y;
    }
}
