import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Joueur } from '@app/classes/joueur';
import { MAX_CARACT, MAX_VALUE_TIME, MIN_CARACT, MIN_VALUE_TIME, TEMPS_DEFAUT } from '@app/constantes/constantes-partie';
import { GestionnaireDeSocketService } from '@app/services/gestionnaire-de-socket.service';
import { configuration } from '@app/services/point-entree-service.service';

interface Dict {
    name: string;
    description: string;
}

@Component({
    selector: 'app-partie-solo',
    templateUrl: './partie-solo.component.html',
    styleUrls: ['./partie-solo.component.scss'],
})
export class PartieSoloComponent {
    profileForm: FormGroup;
    min: number;
    max: number;
    dictionnaires: Dict[];
    dictionnaireControle: FormControl;

    get aliases() {
        return this.profileForm.get('aliases') as FormArray;
    }

    constructor(private fb: FormBuilder, private router: Router, private gestionnaireDeSocketService: GestionnaireDeSocketService) {
        this.profileForm = this.fb.group({
            nomUtilisateur: ['', [Validators.required, Validators.minLength(MIN_CARACT), Validators.maxLength(MAX_CARACT)]],
            delaiTour: [TEMPS_DEFAUT, [Validators.min(MIN_VALUE_TIME), Validators.max(MAX_VALUE_TIME), Validators.required]],
            profilJV: ['', Validators.required],
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
        configuration.joueurs.push(new Joueur(this.profileForm.get('nomUtilisateur')?.value, this.gestionnaireDeSocketService.socket.id));
        configuration.minuterie = this.profileForm.get('delaiTour')?.value;
        this.gestionnaireDeSocketService.emit('initPartieSolo', configuration);
        this.gestionnaireDeSocketService.emit('getTempsInitial', this.profileForm.get('delaiTour')?.value);
        this.gestionnaireDeSocketService.emit('initMinuterie');
        this.gestionnaireDeSocketService.socket.on('debutPartieSolo', () => {
            this.gestionnaireDeSocketService.socket.emit('nouveauNomDeJoueur', this.profileForm.get('nomUtilisateur')?.value);
            this.router.navigate(['game']);
        });
    }
}
