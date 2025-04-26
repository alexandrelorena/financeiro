import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddDespesaComponent } from './component/add-despesa/add-despesa.component';
import { ContentComponent } from './component/content/content.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/content', pathMatch: 'full' },
  { path: 'add-despesa', component: AddDespesaComponent },
  { path: 'content', component: ContentComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
