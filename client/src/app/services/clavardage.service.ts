import { Injectable } from '@angular/core';
import { Clavardage } from '@app/interfaces/clavardage';
import { GestionnaireDeSocketService } from '@app/services/gestionnaire-de-socket.service';

@Injectable({
    providedIn: 'root',
})
export class ClavardageService {
    constructor(private serviceGestionnaireDeSocket: GestionnaireDeSocketService) {}

    envoyerMessage(message: Clavardage): void {
        message.auteur = this.getClavardageId();
        if (message.message.charAt(0) === '!') {
            this.envoyerCommande(message);
        } else this.serviceGestionnaireDeSocket.emit('messageNormal', message.message);
    }

    private envoyerCommande(commande: Clavardage): void {
        this.serviceGestionnaireDeSocket.emit('commande', commande);
    }

    private getClavardageId(): string {
        return this.serviceGestionnaireDeSocket.socket.id;
    }
}
