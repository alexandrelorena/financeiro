// Importa os módulos necessários do Angular
import { NgModule } from '@angular/core'; // Módulo principal do Angular
import { RouterModule, Routes } from '@angular/router'; // Importa o RouterModule e o tipo Routes para definir rotas

// Importa os componentes que serão utilizados nas rotas
import { AddDespesaComponent } from './component/add-despesa/add-despesa.component'; // Componente para adicionar despesas
import { ContentComponent } from './component/content/content.component'; // Componente de conteúdo principal
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Define as rotas da aplicação
const routes: Routes = [
  { path: '', redirectTo: '/content', pathMatch: 'full' }, // Se a URL estiver vazia, redireciona para 'content' (página inicial)
  { path: 'add-despesa', component: AddDespesaComponent }, // Quando o caminho for 'add-despesa', o AddDespesaComponent será carregado
  { path: 'content', component: ContentComponent }, // Quando o caminho for 'content', o ContentComponent será carregado
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/page-not-found' }, // Rota de fallback para URLs inválidas
];

// Configura o módulo de rotas
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Importa as rotas definidas e as registra como rotas principais da aplicação
  exports: [RouterModule], // Exporta o RouterModule para que outras partes da aplicação possam usá-lo
})
export class AppRoutingModule {} // Declara o módulo de roteamento da aplicação
