/* eslint-disable @typescript-eslint/no-magic-numbers */
import { MinuteriePipe } from './minuterie.pipe';

describe('MinuteriePipe', () => {
    const pipe = new MinuteriePipe();
    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('devrait retourner le bon format', () => {
        expect(pipe.transform(119)).toBe('1:59');
        expect(pipe.transform(9)).toBe('0:09');
        expect(pipe.transform(69)).toBe('1:09');
    });
});
