import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const TAILLE_MAX = 12;
export const TAILLE_MIN = 8;
export const TAILLE_INITIALE = 10;

@Injectable({
    providedIn: 'root',
})
export class TaillePoliceService {
    police: Observable<number>;
    private taillePolice: number;
    private policeSubject: Subject<number>;
    constructor() {
        this.taillePolice = TAILLE_INITIALE;
        this.policeSubject = new Subject<number>();
        this.police = this.policeSubject.asObservable();
    }

    changerPolice(operator: string): void {
        if (operator === '+') {
            if (this.taillePolice < TAILLE_MAX) this.taillePolice++;
        } else if (this.taillePolice > TAILLE_MIN) this.taillePolice--;
        this.policeSubject.next(this.taillePolice);
    }
}
