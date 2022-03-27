import { Component, OnInit } from '@angular/core';
import { Joueur } from '@app/classes/joueur';
import { InfoFinPartie } from '@app/interfaces/info-fin-partie';
import { InfoPartie } from '@app/interfaces/info-partie';
import { GestionnaireDeSocketService } from '@app/services/gestionnaire-de-socket.service';

@Component({
    selector: 'app-panneau-informatif',
    templateUrl: './panneau-informatif.component.html',
    styleUrls: ['./panneau-informatif.component.scss'],
})
export class PanneauInformatifComponent implements OnInit {
    utilisateur: Joueur;
    adversaire: Joueur;
    joueurActif: string;
    temps: number;
    reserve: number;
    private partieEstFinie: boolean;

    constructor(private serviceGestionnaireDeSocket: GestionnaireDeSocketService) {
        this.serviceGestionnaireDeSocket.getInfoPartie().subscribe((partie: InfoPartie) => {
            this.updatePanneau(partie);
        });
        this.serviceGestionnaireDeSocket.getFinPartie().subscribe((finPartie: InfoFinPartie) => {
            this.annoncerGagnant(finPartie);
            this.partieEstFinie = true;
        });
        this.partieEstFinie = false;
    }

    ngOnInit(): void {
        this.getMinuterie();
    }

    private getMinuterie() {
        this.serviceGestionnaireDeSocket.socket.on('minuterie', (tempsRestant: number) => {
            this.temps = tempsRestant;
        });
    }

    private updatePanneau(partie: InfoPartie): void {
        if (!this.partieEstFinie) {
            this.reserve = partie.reserve.length;
            this.joueurActif = partie.joueurActif.nom;
            partie.joueurs.forEach((joueur) => {
                if (joueur.id === this.serviceGestionnaireDeSocket.socket.id) this.utilisateur = joueur;
                else this.adversaire = joueur;
            });
        }
    }

    private annoncerGagnant(finPartie: InfoFinPartie) {
        let message = '';
        if (finPartie.nomGagnant === '') {
            message = this.utilisateur.nom + ' et ' + this.adversaire.nom + ' ont égalité! Félicitations!';
        } else {
            message = finPartie.nomGagnant + ' a gagné! Félicitations!';
        }
        document.getElementsByClassName('tour')[0].innerHTML = message;
    }
}
