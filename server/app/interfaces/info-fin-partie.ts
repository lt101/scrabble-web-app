import { Score } from '@app/interfaces/score';

export interface InfoFinPartie {
    message: string;
    nomGagnant: string;
    scores: Score[];
}
