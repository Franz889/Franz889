import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticasComponent } from './estadisticas';

const routes: Routes = [
  { path: '', component: EstadisticasComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class EstadisticasModule {}
