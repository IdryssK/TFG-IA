import { Routes } from '@angular/router';
import { ConfiguracionesComponent } from './configuraciones.component';
import {ConfiguracionComponent} from './configuracion/configuracion.component'
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
    {
        path: 'configuracion/:idx',
        component: ConfiguracionComponent
    },

] as Routes;
