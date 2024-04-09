import { Routes } from '@angular/router';
import { ConfiguracionesComponent } from './configuraciones.component';

export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'lista',
    },
    {
        path     : 'lista',
        component: ConfiguracionesComponent,
    },
    // {
    //     path: 'crear',
    //     //component: 
    // },
    // {
    //     path: 'editar/:id',
    //     component: EditUserComponent
    // },
] as Routes;
