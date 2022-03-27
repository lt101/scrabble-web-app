import { AfterViewInit, Component } from '@angular/core';
import { Score } from '@app/interfaces/score';
import { GestionnaireDeSocketService } from '@app/services/gestionnaire-de-socket.service';

@Component({
    selector: 'app-meilleurs-scores',
    templateUrl: './meilleurs-scores.component.html',
    styleUrls: ['./meilleurs-scores.component.scss'],
})
export class MeilleursScoresComponent implements AfterViewInit {
    scores: Score[];
    constructor(private serviceGestionnaireDeSocket: GestionnaireDeSocketService) {}

    ngAfterViewInit(): void {
        this.serviceGestionnaireDeSocket.socket.on('meilleursScores', (scores: Score[]) => {
            this.scores = scores;
        });
    }
}
