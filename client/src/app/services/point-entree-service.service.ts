import { Injectable } from '@angular/core';
import { ConfigPartie } from '@app/interfaces/config-partie';
// import { configuration } from '@app/global/map';
import { Mode } from '@app/interfaces/mode';
import { Option } from '@app/interfaces/option';

export const configuration: ConfigPartie = { mode: '', option: '', joueurs: [], minuterie: 0 };

@Injectable({
    providedIn: 'root',
})
export class PointEntreeServiceService {
    isClassiqueMode: boolean = false;
    isLog2990Mode: boolean = false;
    isSoloOption: boolean = false;
    isCreerOption: boolean = false;
    isJoindreOption: boolean = false;

    reinitialiserConfiguration() {
        configuration.mode = '';
        configuration.option = '';
    }

    activerClassiqueMode() {
        this.isClassiqueMode = true;
        this.isLog2990Mode = !this.isClassiqueMode;
    }

    activerLog2990Mode() {
        this.isLog2990Mode = true;
        this.isClassiqueMode = !this.isLog2990Mode;
    }
    activerSoloOption() {
        this.isSoloOption = true;
        this.isCreerOption = !this.isSoloOption;
        this.isJoindreOption = !this.isSoloOption;
    }
    activerCreerOption() {
        this.isCreerOption = true;
        this.isSoloOption = !this.isCreerOption;
        this.isJoindreOption = !this.isCreerOption;
    }
    activerJoidreOption() {
        this.isCreerOption = !this.isJoindreOption;
        this.isSoloOption = !this.isJoindreOption;
        this.isJoindreOption = true;
    }

    changerMode() {
        if (this.isClassiqueMode === true) {
            this.setMode(Mode.CLASSIQUE);
        } else {
            this.setMode(Mode.LOG2990);
        }
    }

    setMode(mode: string) {
        configuration.mode = mode;
    }

    changerOption() {
        if (this.isSoloOption === true) {
            this.setOption(Option.SOLO);
        }
        if (this.isCreerOption === true) {
            this.setOption(Option.CREER);
        }
        if (this.isJoindreOption === true) {
            this.setOption(Option.JOINDRE);
        }
    }

    setOption(option: string) {
        configuration.option = option;
    }
}
