import { ElementRef, Injectable, QueryList } from '@angular/core';
import { Chevalet, MAXLETTRES } from '@app/classes/chevalet';
import { Lettre } from '@app/classes/lettre';
import { DEPLACEMENT_DROITE, DEPLACEMENT_GAUCHE, LETTRE_ABSENTE, MIN_INDEX, PAS_SELECT } from '@app/constantes/chevalet.service.constantes';
import { InfoPartie } from '@app/interfaces/info-partie';
import { ReponseCommande } from '@app/interfaces/reponse-commande';
import { GestionnaireDeSocketService } from '@app/services/gestionnaire-de-socket.service';
import { GestionnaireDeCommandeService } from './gestionnaire-de-commande.service';

@Injectable({
    providedIn: 'root',
})
export class ChevaletService {
    chevalet: Chevalet;
    selectManip: number; // index de la lettre selectionnée pour manipulation
    selectEchange: number[]; // index des lettres sélectionnées pour échange
    lettres: QueryList<ElementRef>;

    constructor(private socketService: GestionnaireDeSocketService, private gestionnaireCommande: GestionnaireDeCommandeService) {
        this.socketService.getInfoPartie().subscribe((infoPartie: InfoPartie) => {
            this.chevalet =
                infoPartie.joueurs[0].id === this.socketService.socket.id ? infoPartie.joueurs[0].chevalet : infoPartie.joueurs[1].chevalet;
            this.updateVue();
        });
        this.socketService.getReponseCommande().subscribe((reponseCommande) => {
            this.updateApresEchange(reponseCommande);
        });
        this.chevalet = new Chevalet();
        this.selectEchange = [];
        this.selectManip = PAS_SELECT;
    }

    ajouterLettres(lettresAAfficher: string) {
        let lettre: Lettre;
        for (const char of lettresAAfficher) {
            lettre = new Lettre(char);

            if (this.chevalet.lettres.length < MAXLETTRES) {
                this.chevalet.lettres.push(lettre);
            }
        }
        this.updateVue();
    }

    retirerLettres(lettresARetirer: string): void {
        let lettre: Lettre;
        for (const char of lettresARetirer) {
            lettre = new Lettre(char);

            if (this.chevalet.lettres.length > 0) {
                const index = this.chevalet.lettres.findIndex((value) => value.lettre === lettre.lettre);
                if (index !== LETTRE_ABSENTE) this.chevalet.lettres.splice(index, 1);
            }
        }
        this.updateVue();
    }

    contientLettre(lettre: string): boolean {
        if (lettre.match(/[A-Z]/)) lettre = '*';
        const estContenu = this.chevalet.lettres.find((value) => {
            return value.lettre === lettre;
        });
        return estContenu !== undefined;
    }

    selectionnerManip(index: number): void {
        if (this.selectManip === index) {
            this.selectManip = PAS_SELECT;
        } else this.selectManip = index;
        this.selectEchange = [];
    }

    selectionnerClavier(lettre: string): boolean {
        let estSelect = false;
        const indexLettresPareilles: number[] = [];

        this.chevalet.lettres.forEach((value, index) => {
            if (value.lettre === lettre) indexLettresPareilles.push(index);
        });

        indexLettresPareilles.forEach((index) => {
            if (this.selectManip < index && !estSelect) {
                this.selectManip = index;
                estSelect = true;
            }
        });
        if (!estSelect)
            if (indexLettresPareilles.length !== 0) this.selectManip = indexLettresPareilles[0];
            else this.selectManip = PAS_SELECT;
        return estSelect;
    }

    selectionnerEchange($event: Event, index: number): void {
        $event.preventDefault();
        if (this.selectEchange.indexOf(index) === PAS_SELECT) {
            this.selectEchange.push(index);
        } else {
            const i = this.selectEchange.indexOf(index);
            this.selectEchange.splice(i, 1);
        }
        this.selectManip = PAS_SELECT;
    }

    estSelectionEchange(index: number): boolean {
        let estSelect = false;
        this.selectEchange.forEach((value) => {
            if (value === index) estSelect = true;
        });
        return estSelect;
    }

    deplacerLettre(aGauche: boolean): void {
        if (this.selectManip === PAS_SELECT) return;
        const deplacement = aGauche ? DEPLACEMENT_GAUCHE : DEPLACEMENT_DROITE;
        const lettreADeplacer = this.chevalet.lettres[this.selectManip];

        let nouvellePosition: number;

        if (this.selectManip === this.chevalet.lettres.length - 1 && !aGauche) nouvellePosition = 0;
        else if (this.selectManip === MIN_INDEX && aGauche) nouvellePosition = this.chevalet.lettres.length - 1;
        else nouvellePosition = this.selectManip + deplacement;

        this.chevalet.lettres[this.selectManip] = this.chevalet.lettres[nouvellePosition];
        this.chevalet.lettres[nouvellePosition] = lettreADeplacer;
        this.selectManip = nouvellePosition;

        this.updateVue();
    }

    echangerLettres() {
        let message = '!echanger ';
        for (const index of this.selectEchange) {
            message += this.chevalet.lettres[index].lettre.toLowerCase();
        }
        this.gestionnaireCommande.envoyerCommande(message);
        this.selectEchange = [];
    }

    private afficherLettre(lettre: ElementRef | undefined, index: number): boolean {
        if (!lettre) return false;
        if (index < this.chevalet.lettres.length) {
            lettre.nativeElement.style.visibility = 'visible';
            lettre.nativeElement.getElementsByClassName('valeur')[0].innerHTML =
                this.chevalet.lettres[index].lettre === '*' ? '' : this.chevalet.lettres[index].lettre.toUpperCase();

            if (this.chevalet.lettres[index].valeur !== 0) {
                lettre.nativeElement.getElementsByClassName('pointage')[0].innerHTML = this.chevalet.lettres[index].valeur.toString();
            } else lettre.nativeElement.getElementsByClassName('pointage')[0].innerHTML = '';
        } else lettre.nativeElement.style.visibility = 'hidden';

        return true;
    }

    private updateApresEchange(reponseCommande: ReponseCommande): void {
        switch (reponseCommande.type) {
            case 'echanger':
                if (reponseCommande.succes && reponseCommande.idJoueur === this.socketService.socket.id) {
                    this.chevalet = JSON.parse(reponseCommande.resultat.split(' ')[1]);
                    this.updateVue();
                }
                break;
            case 'placer':
                if (reponseCommande.succes && reponseCommande.idJoueur === this.socketService.socket.id && reponseCommande.score >= 0) {
                    this.chevalet = JSON.parse(reponseCommande.resultat).chevalet;
                    this.updateVue();
                }
                break;
            default:
                break;
        }
    }

    private updateVue(): void {
        let lettreCourante: ElementRef | undefined;
        for (let i = 0; i < MAXLETTRES; i++) {
            lettreCourante = this.lettres.find((element) => element.nativeElement.id === 'chevalet' + i);
            this.afficherLettre(lettreCourante, i);
        }
    }
}
