import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Clavardage } from '@app/interfaces/clavardage';
import { InfoFinPartie } from '@app/interfaces/info-fin-partie';
import { ClavardageService } from '@app/services/clavardage.service';
import { GestionnaireDeCommandeService } from '@app/services/gestionnaire-de-commande.service';
import { GestionnaireDeSocketService } from '@app/services/gestionnaire-de-socket.service';

@Component({
    selector: 'app-boite-clavardage',
    templateUrl: './boite-clavardage.component.html',
    styleUrls: ['./boite-clavardage.component.scss'],
})
export class BoiteClavardageComponent implements OnInit, OnDestroy {
    @ViewChild('clavardage', { static: false }) private clavardage!: ElementRef<HTMLCanvasElement>;
    @ViewChild('envoieMessage', { static: false }) private envoieMessage!: ElementRef<HTMLCanvasElement>;
    @ViewChild('entree', { static: false }) private entree!: ElementRef<HTMLInputElement>;
    utilisateur: string;
    message: string;
    wClavardages: Clavardage[];
    private partieEstFinie: boolean;

    constructor(
        private serviceClavardage: ClavardageService,
        private serviceGestionnaireDeSocket: GestionnaireDeSocketService,
        private serviceGestionnaireDeCommande: GestionnaireDeCommandeService,
    ) {
        this.wClavardages = [];
        this.partieEstFinie = false;
        this.utilisateur = ' ';
    }

    ngOnInit(): void {
        this.wClavardages.push({ auteur: 'Sys', message: 'Bonjour!' });
        this.serviceGestionnaireDeSocket.emit('rejoindreClavardage');
        this.serviceGestionnaireDeSocket.getMessages().subscribe((wClavardage) => {
            this.wClavardages.push(wClavardage);
        });
        this.serviceGestionnaireDeSocket.getFinPartie().subscribe((finPartie: InfoFinPartie) => {
            this.wClavardages.push({ auteur: 'Sys', message: finPartie.message });
            this.partieEstFinie = true;
        });
        this.receptionEvenement();
    }

    ngOnDestroy() {
        this.serviceGestionnaireDeSocket.socket.removeListener();
    }

    envoyerMessage(): void {
        if (this.message.charAt(0) !== '!') {
            this.serviceClavardage.envoyerMessage({ auteur: this.utilisateur, message: this.message });
        } else {
            if (this.message.trim() === '!indice' && this.message.charAt(0) === '!' && !this.partieEstFinie) {
                this.wClavardages.push({ auteur: 'Sys', message: 'Calcul en cours. Veuillez patienter.' });
            }
            this.serviceGestionnaireDeCommande.envoyerCommande(this.message);
        }
        this.clavardage.nativeElement.scrollTop = this.clavardage.nativeElement.scrollHeight;
        this.entree.nativeElement.value = '';
    }

    toucheEnterPresser(e: Event): void {
        e.preventDefault();
        this.envoyerMessage();
    }

    private receptionEvenement(): void {
        setTimeout(() => {
            this.envoieMessage.nativeElement.focus();
        });
    }
}
