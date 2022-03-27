import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeilleursScoresComponent } from '@app/components/meilleurs-scores/meilleurs-scores.component';
import { ModeClassiqueComponent } from '@app/components/mode-classique/mode-classique.component';
import { ModeLOG2990Component } from '@app/components/mode-log2990/mode-log2990.component';
import { PartieSoloComponent } from '@app/components/partie-solo/partie-solo.component';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: 'mode', component: GameModeComponent },
    { path: 'classique', component: ModeClassiqueComponent },
    { path: 'LOG2990', component: ModeLOG2990Component },
    { path: 'scores', component: MeilleursScoresComponent },
    { path: 'solo', component: PartieSoloComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
