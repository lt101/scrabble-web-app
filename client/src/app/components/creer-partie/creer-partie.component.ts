import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAX_VALUE_TIME, MIN_VALUE_TIME } from '@app/constantes/constantes-partie';

interface Dict {
    name: string;
    description: string;
}

@Component({
    selector: 'app-creer-partie',
    templateUrl: './creer-partie.component.html',
    styleUrls: ['./creer-partie.component.scss'],
})
export class CreerPartieComponent {
    profileForm: FormGroup;
    min: number;
    max: number;
    dictionnaires: Dict[];
    dictionnaireControle: FormControl;

    constructor(private fb: FormBuilder, private router: Router) {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            joueurVirtuel: ['', Validators.required],
            dictionnaire: this.dictionnaireControle,
            descriptionDictionnaire: ['', Validators.required],
            delaiTour: [MIN_VALUE_TIME, [Validators.min(MIN_VALUE_TIME), Validators.max(MAX_VALUE_TIME), Validators.required]],
        });
        this.min = MIN_VALUE_TIME;
        this.max = MAX_VALUE_TIME;
        this.dictionnaires = [
            { name: 'larousse', description: 'blabla' },
            { name: 'le petit robert', description: 'dictionaries interessant' },
            { name: 'cambridge', description: 'tres bien' },
        ];
        this.dictionnaireControle = new FormControl('', Validators.required);
    }

    onSubmit() {
        this.router.navigate(['game']);
    }
}
