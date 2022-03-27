import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { BoiteClavardageComponent } from './components/boite-clavardage/boite-clavardage.component';
import { BoutonEchangeComponent } from './components/bouton-echange/bouton-echange.component';
import { ChevaletComponent } from './components/chevalet/chevalet.component';
import { CreerPartieComponent } from './components/creer-partie/creer-partie.component';
import { JoindrePartieComponent } from './components/joindre-partie/joindre-partie.component';
import { MeilleursScoresComponent } from './components/meilleurs-scores/meilleurs-scores.component';
import { ModeClassiqueComponent } from './components/mode-classique/mode-classique.component';
import { ModeLOG2990Component } from './components/mode-log2990/mode-log2990.component';
import { PanneauInformatifComponent } from './components/panneau-informatif/panneau-informatif.component';
import { PartieSoloComponent } from './components/partie-solo/partie-solo.component';
import { GameModeComponent } from './pages/game-mode/game-mode.component';
import { MinuteriePipe } from './pipes/minuterie.pipe';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        BoiteClavardageComponent,
        PanneauInformatifComponent,
        GameModeComponent,
        ModeClassiqueComponent,
        ModeLOG2990Component,
        MeilleursScoresComponent,
        ChevaletComponent,
        PartieSoloComponent,
        JoindrePartieComponent,
        CreerPartieComponent,
        MinuteriePipe,
        BoutonEchangeComponent,
    ],
    entryComponents: [MeilleursScoresComponent],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, ReactiveFormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
