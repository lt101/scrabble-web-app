import { Injectable } from '@angular/core';
import { Lettre } from '@app/classes/lettre';
import { Clavardage } from '@app/interfaces/clavardage';
import { Coordonnee } from '@app/interfaces/coordonnee';
import { InfoFinPartie } from '@app/interfaces/info-fin-partie';
import { InfoPartie } from '@app/interfaces/info-partie';
import { ReponseCommande } from '@app/interfaces/reponse-commande';
import { Observable, Subscriber } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

const INVALIDE = -1;

@Injectable({
    providedIn: 'root',
})
export class GestionnaireDeSocketService {
    partie: InfoPartie;

    socket = io(environment.socketUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
    });

    getInfoPartie(): Observable<InfoPartie> {
        const observable = new Observable<InfoPartie>((subscriber) => {
            this.socket.on('updateInfoPartie', (infoPartie: InfoPartie) => {
                this.partie = infoPartie;
                subscriber.next(infoPartie);
            });
        });
        return observable;
    }

    getFinPartie(): Observable<InfoFinPartie> {
        const observable = new Observable<InfoFinPartie>((subscriber) => {
            this.socket.on('finPartie', (finPartie: InfoFinPartie) => {
                subscriber.next(finPartie);
            });
        });
        return observable;
    }

    getMessages(): Observable<Clavardage> {
        const observable = new Observable<Clavardage>((observer) => {
            this.socket.on('clavardagePartie', (messageValider: string) => {
                const message = { auteur: JSON.parse(messageValider).auteur, message: JSON.parse(messageValider).message };
                this.incrementationObservableMessage(message, observer);
            });
            this.socket.on('reponseCommande', (reponseCommande: ReponseCommande) => {
                this.incrementationObservableMessage(this.determinerMessage(reponseCommande), observer);
            });
        });
        return observable;
    }

    getReponseCommande(): Observable<ReponseCommande> {
        const observable = new Observable<ReponseCommande>((subscriber) => {
            this.socket.on('reponseCommande', (reponseCommande: ReponseCommande) => {
                subscriber.next(reponseCommande);
            });
        });
        return observable;
    }

    getPlacementLettres(): Observable<{ lettres: Lettre[]; coordonnees: Coordonnee[] }> {
        const observable = new Observable<{ lettres: Lettre[]; coordonnees: Coordonnee[] }>((observer) => {
            this.socket.on('reponseCommande', (reponseCommande: ReponseCommande) => {
                if (reponseCommande.type === 'placer') this.incrementationObservablePlacement(reponseCommande, observer);
            });
        });
        return observable;
    }

    emit(nomEvenement: string, donne?: unknown) {
        this.socket.emit(nomEvenement, donne);
    }

    private incrementationObservableMessage(messageValider: Clavardage, observer: Subscriber<Clavardage>): boolean {
        observer.next(messageValider);
        return true;
    }

    private incrementationObservablePlacement(
        messageValider: ReponseCommande,
        observer: Subscriber<{ lettres: Lettre[]; coordonnees: Coordonnee[] }>,
    ): boolean {
        const donnees = JSON.parse(messageValider.resultat);
        if (messageValider.score !== INVALIDE && messageValider.succes) {
            observer.next({ lettres: donnees.lettres, coordonnees: donnees.coordonnes });
        }
        return true;
    }

    private determinerMessage(reponseCommande: ReponseCommande): Clavardage {
        const message = { auteur: 'Sys', message: '' };
        if (reponseCommande.succes) {
            switch (reponseCommande.type) {
                case 'placer':
                    if (reponseCommande.score >= 0) {
                        message.message =
                            reponseCommande.nomJoueur +
                            ' a placé les lettres: ' +
                            reponseCommande.argument.split(' ')[1] +
                            ' et a obtenu ' +
                            reponseCommande.score +
                            ' points!';
                    } else {
                        message.message =
                            reponseCommande.nomJoueur +
                            ' a placé les lettres: ' +
                            reponseCommande.argument.split(' ')[1] +
                            ' est a créé les mots invalides: ' +
                            this.reponsePlacementInvalide(JSON.parse(reponseCommande.resultat).motsInvalides) +
                            '. Aucun point obtenu!';
                    }
                    break;
                case 'echanger':
                    if (this.socket.id === reponseCommande.idJoueur)
                        message.message = reponseCommande.nomJoueur + ' a échangé les lettres: ' + reponseCommande.argument.split(' ')[0];
                    else message.message = reponseCommande.nomJoueur + ' a échangé ' + reponseCommande.argument.split(' ')[0].length + ' lettres.';
                    break;
                case 'passer':
                    message.message = reponseCommande.nomJoueur + ' a passé son tour.';
                    break;

                default:
                    break;
            }
        } else {
            switch (reponseCommande.type) {
                case 'reserve':
                    if (reponseCommande.messageErreur === '') message.message = "Voici l'état actuel de la réserve:\n" + reponseCommande.resultat;
                    else message.message = reponseCommande.messageErreur;
                    break;
                case 'indice':
                    if (reponseCommande.messageErreur === '') message.message = reponseCommande.resultat;
                    else message.message = reponseCommande.messageErreur;
                    break;
                default:
                    message.message = reponseCommande.messageErreur;
                    break;
            }
        }
        return message;
    }

    private reponsePlacementInvalide(motsInvalides: string[]): string {
        let resultat = '';
        switch (motsInvalides.length) {
            case 1:
                return motsInvalides[0];
            case 2:
                return motsInvalides[0] + ' et ' + motsInvalides[1];
            default:
                for (let i = 0; i < motsInvalides.length; i++) {
                    if (i < motsInvalides.length - 1) {
                        resultat += motsInvalides[i] + ', ';
                    } else {
                        resultat += 'et ' + motsInvalides[i];
                    }
                }
                return resultat;
        }
    }
}
