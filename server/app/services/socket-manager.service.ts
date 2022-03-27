import { EtatPartie } from '@app/classes/partie';
import { DELAI_AVANT_EMISSION, TAILLE_MESSAGE_MAXIMAL } from '@app/constantes/gestionnaire-de-socket-serveur.constants';
import { Commande } from '@app/interfaces/commande';
import { ConfigPartie } from '@app/interfaces/config-partie';
import { InfoPartie } from '@app/interfaces/info-partie';
import { ReponseCommande } from '@app/interfaces/reponse-commande';
import * as http from 'http';
import * as io from 'socket.io';
import { GestionnairePartiesService } from './gestionnaire-parties.service';

const UNE_MINUTE = 60;

export class SocketManager {
    private sio: io.Server;
    private room: string;
    private gestionnairePartiesService: GestionnairePartiesService;
    private idNomDeJoueur: Map<string, string>;
    private tempsRestant: number;
    private aEnvoyeMessageDeFin: boolean;

    constructor(server: http.Server) {
        this.room = 'serveurPartie';
        this.idNomDeJoueur = new Map<string, string>();
        this.tempsRestant = UNE_MINUTE;
        this.aEnvoyeMessageDeFin = false;
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.gestionnairePartiesService = new GestionnairePartiesService();
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('initPartieSolo', (config: ConfigPartie) => {
                const idPartie = 'idPartieInit';
                this.sio.to(socket.id).emit('debutPartieSolo');
                this.sio.to(socket.id).emit('updateInfoPartie', this.gestionnairePartiesService.creerPartie(idPartie, config).partie);
                if (
                    this.gestionnairePartiesService.parties.get(idPartie)?.partie.joueurActif.nom ===
                    this.gestionnairePartiesService.parties.get(idPartie)?.partie.joueurs[1].nom
                )
                    this.sio.to(socket.id).emit('reponseCommande', this.gestionnairePartiesService.parties.get(idPartie)?.tourJoueurVirtuel());
                this.sio.to(socket.id).emit('updateInfoPartie', this.gestionnairePartiesService.parties.get(idPartie)?.partie);
            });

            socket.on('getTempsInitial', (tempsInitial: number) => {
                this.tempsRestant = tempsInitial * UNE_MINUTE;
            });

            socket.on('initMinuterie', () => {
                setInterval(() => {
                    this.emitMinuterie();
                }, DELAI_AVANT_EMISSION);
            });

            socket.on('messageNormal', (message: string) => {
                if (message.length < TAILLE_MESSAGE_MAXIMAL && this.sio.sockets.adapter.rooms.get(this.room)?.has(socket.id)) {
                    this.sio.to(this.room).emit('clavardagePartie', JSON.stringify({ auteur: this.idNomDeJoueur[socket.id], message }));
                } else if (!this.sio.sockets.adapter.rooms.get(this.room)?.has(socket.id)) {
                    this.sio.to(socket.id).emit(
                        'clavardagePartie',
                        JSON.stringify({
                            auteur: 'Sys',
                            message: "Vous n'etes pas en partie",
                        }),
                    );
                } else {
                    this.sio.to(this.room).emit('clavardagePartie', JSON.stringify({ auteur: 'Sys', message: 'Entrée invalide' }));
                }
            });

            socket.on('commande', (commande: Commande) => {
                commande.nomJoueur = this.idNomDeJoueur[commande.idJoueur];
                const roomSockets = this.sio.sockets.adapter.rooms.get(this.room);
                const reponseDuTraitement = this.gestionnairePartiesService.acheminerCommande(commande);
                const tempsInitial = this.gestionnairePartiesService.parties.get(commande.idPartie)?.partie.minuterie;
                if (roomSockets?.has(socket.id)) {
                    if (reponseDuTraitement && reponseDuTraitement.succes) {
                        this.traiterReponse(reponseDuTraitement, commande);
                        if (tempsInitial) this.tempsRestant = tempsInitial * UNE_MINUTE;
                    } else this.sio.to(socket.id).emit('reponseCommande', reponseDuTraitement);
                } else {
                    this.sio.to(socket.id).emit(
                        'clavardagePartie',
                        JSON.stringify({
                            auteur: 'Sys',
                            message: 'Il y a un probleme avec votre commande...',
                        }),
                    );
                }
                if (this.gestionnairePartiesService.parties.get(commande.idPartie)?.etat === EtatPartie.FinPartie && !this.aEnvoyeMessageDeFin) {
                    this.sio.to(this.room).emit('finPartie', this.gestionnairePartiesService.parties.get(commande.idPartie)?.finPartie);
                    this.aEnvoyeMessageDeFin = true;
                }
            });

            socket.on('rejoindreClavardage', () => {
                socket.join(this.room);
            });

            socket.on('nouveauNomDeJoueur', (nomDuJoueur: string) => {
                this.idNomDeJoueur[socket.id] = nomDuJoueur;
                this.sio.sockets.emit('NomCorrectementAjouter');
            });

            socket.on('disconnect', (reason) => {
                this.sio.to(this.room).emit('clavardagePartie', JSON.stringify({ auteur: 'Sys', message: reason }));
            });
        });
    }

    private emitMinuterie() {
        this.sio.sockets.emit('minuterie', this.minuterie());
    }

    private minuterie(): number {
        if (this.tempsRestant > 0) {
            return this.tempsRestant--;
        }
        if (this.tempsRestant === 0) {
            this.passerTourTemps('idPartieInit');
        }
        return this.tempsRestant;
    }

    private updateInfoPartie(info: InfoPartie | undefined): void {
        this.sio.to(this.room).emit('updateInfoPartie', info);
    }

    private passerTourTemps(idPartie: string): void {
        const partieCourante = this.gestionnairePartiesService.parties.get(idPartie);
        if (partieCourante) {
            const commande: Commande = {
                idJoueur: partieCourante?.partie.joueurActif.id,
                nomJoueur: partieCourante?.partie.joueurActif.nom,
                idPartie,
                type: 'passer',
                argument: '',
            };

            commande.nomJoueur = this.idNomDeJoueur[commande.idJoueur];
            const reponseDuTraitement = this.gestionnairePartiesService.acheminerCommande(commande);
            if (reponseDuTraitement && reponseDuTraitement.succes) {
                this.traiterReponse(reponseDuTraitement, commande);
                const tempsInitial = this.gestionnairePartiesService.parties.get(commande.idPartie)?.partie.minuterie;
                if (tempsInitial) this.tempsRestant = tempsInitial * UNE_MINUTE;
            }
        }
    }

    private traiterReponse(reponseDuTraitement: ReponseCommande, commande: Commande): void {
        this.sio.to(this.room).emit('reponseCommande', reponseDuTraitement);
        this.updateInfoPartie(this.gestionnairePartiesService.parties.get(commande.idPartie)?.partie);
        if (this.gestionnairePartiesService.parties.get(commande.idPartie)?.estPartieSolo)
            this.sio.to(this.room).emit('reponseCommande', this.gestionnairePartiesService.parties.get(commande.idPartie)?.tourJoueurVirtuel());
        this.updateInfoPartie(this.gestionnairePartiesService.parties.get(commande.idPartie)?.partie);
    }
}
