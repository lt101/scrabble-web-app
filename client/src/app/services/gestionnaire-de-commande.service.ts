import { Injectable } from '@angular/core';
import { Commande } from '@app/interfaces/commande';
import { GestionnaireDeSocketService } from './gestionnaire-de-socket.service';

@Injectable({
    providedIn: 'root',
})
export class GestionnaireDeCommandeService {
    constructor(private serviceGestionnaireDeSocket: GestionnaireDeSocketService) {}

    envoyerCommande(message: string): void {
        const messageSplit = message.split(' ');
        const commande: Commande = {
            idJoueur: this.serviceGestionnaireDeSocket.socket.id,
            nomJoueur: '',
            idPartie: this.serviceGestionnaireDeSocket.partie.idPartie,
            type: messageSplit[0].substring(1),
            argument: '',
        };
        if (commande.type === 'echanger') {
            commande.argument = messageSplit[1];
        } else {
            commande.argument = messageSplit[1] ? messageSplit[1] + ' ' + messageSplit[2] : '';
        }
        this.serviceGestionnaireDeSocket.emit('commande', commande);
    }
}
