import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrarComponent } from './pages/facturacion/administrar/administrar.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';

const routes: Routes = [
  {
    path: 'facturacion',
    component: FacturacionComponent,
    children: [
      {
        path: 'nuevo',
        component: AdministrarComponent,
      },
      {
        path: 'edicion/:id',
        component: AdministrarComponent,
      },
    ],
  },
  { path: '', redirectTo: 'facturacion', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
