import { Component } from '@angular/core';
import { GestionnaireDeCommandeService } from '@app/services/gestionnaire-de-commande.service';
import { GestionnaireDeSocketService } from '@app/services/gestionnaire-de-socket.service';
import { PlacementManuelService } from '@app/services/placement-manuel.service';
import { TaillePoliceService } from '@app/services/taille-police.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(
        private tailleService: TaillePoliceService,
        private commande: GestionnaireDeCommandeService,
        private serviceGestionnaireDeSocket: GestionnaireDeSocketService,
        private placementManuel: PlacementManuelService,
    ) {
        this.serviceGestionnaireDeSocket.getFinPartie().subscribe(() => {
            document.getElementsByClassName('bouton-abandonner')[0].innerHTML = 'Quitter';
        });
    }

    changerPolice(operator: string) {
        this.tailleService.changerPolice(operator);
    }

    passerTour() {
        this.commande.envoyerCommande('!passer');
    }

    focusOut($event: FocusEvent) {
        if ($event.relatedTarget) {
            if (($event.relatedTarget as HTMLElement).id !== 'bouton-jouer') this.placementManuel.reinitialiserPlacement();
        } else this.placementManuel.reinitialiserPlacement();
    }

    envoyerPlacement() {
        this.placementManuel.envoyerCommande();
        this.placementManuel.reinitialiserPlacement();
    }
}
