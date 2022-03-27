import { Component } from '@angular/core';
import { ChevaletService } from '@app/services/chevalet.service';
import { GestionnaireDeSocketService } from '@app/services/gestionnaire-de-socket.service';

const RESERVE_SUFFISANTE = 6;

@Component({
    selector: 'app-bouton-echange',
    templateUrl: './bouton-echange.component.html',
    styleUrls: ['./bouton-echange.component.scss'],
})
export class BoutonEchangeComponent {
    estTourJoueur: boolean;
    private qteLettre: number;

    constructor(private chevaletService: ChevaletService, private socketService: GestionnaireDeSocketService) {
        this.socketService.getInfoPartie().subscribe((infoPartie) => {
            this.estTourJoueur = infoPartie.joueurs[0].estMonTour;
            this.qteLettre = infoPartie.reserve.length;
        });
    }

    boutonActif(): boolean {
        return this.chevaletService.selectEchange.length !== 0 && this.estTourJoueur && this.qteLettre > RESERVE_SUFFISANTE;
    }

    echanger(): void {
        this.chevaletService.echangerLettres();
    }

    annulerEchange() {
        this.chevaletService.selectEchange = [];
    }
}
