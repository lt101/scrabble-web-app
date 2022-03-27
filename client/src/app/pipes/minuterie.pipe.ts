import { Pipe, PipeTransform } from '@angular/core';

const SECONDES_PAR_MINUTE = 60;
const DEUX_CHIFFRES = 10;

@Pipe({
    name: 'minuterie',
})
export class MinuteriePipe implements PipeTransform {
    transform(value: number): string {
        let minuterie = Math.floor(value / SECONDES_PAR_MINUTE) + ':';
        const secondes = value % SECONDES_PAR_MINUTE;
        minuterie += secondes < DEUX_CHIFFRES ? '0' + secondes : secondes;
        return minuterie;
    }
}
