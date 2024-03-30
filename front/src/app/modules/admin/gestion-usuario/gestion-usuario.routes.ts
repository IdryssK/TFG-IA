import { Routes } from '@angular/router';
import { GestionUsuarioComponent } from 'app/modules/admin/gestion-usuario/gestion-usuario.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

export default [
    {
        path     : '',
        pathMatch : 'full',
        redirectTo: 'lista',
    },
    {
        path     : 'lista',
        component: GestionUsuarioComponent,
    },
    {
        path: 'crear',
        component: CreateUserComponent
    },
    {
        path: 'editar/:id',
        component: EditUserComponent
    },

] as Routes;
