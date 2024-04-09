import { Routes } from '@angular/router';
import { CrearDatasetComponent } from './crear-dataset/crear-dataset.component';
import { DatasetComponent } from './dataset.component';

export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'lista',
    },
    {
        path     : 'lista',
        component: DatasetComponent,
    },
    {
        path: 'crear',
        component: CrearDatasetComponent
    },
    // {
    //     path: 'editar/:id',
    //     component: EditUserComponent
    // },
] as Routes;
