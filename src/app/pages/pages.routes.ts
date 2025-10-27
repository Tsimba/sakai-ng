import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { ArticleComponent } from './article/article.component';
import { ClientComponent } from '@/pages/client/client.component';
import { FactureComponent } from '@/pages/facture/facture.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'client', component: ClientComponent },
    { path: 'article', component: ArticleComponent },
    { path: 'facture', component: FactureComponent },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
