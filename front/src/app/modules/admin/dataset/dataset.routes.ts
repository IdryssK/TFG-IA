import { Routes } from '@angular/router';
import { InventoryComponent } from 'app/modules/admin/dataset/inventory/inventory.component';
import { InventoryService } from './inventory/inventory.service';
import { inject } from '@angular/core';
import { InventoryListComponent } from './inventory/list/inventory.component';
import { CrearDatasetComponent } from '../crear-dataset/crear-dataset.component';

export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'lista',
    },
    {
        path     : '',
        component: InventoryComponent,
        children : [
            {
                path     : 'lista',
                component: InventoryListComponent,
                resolve  : {
                    brands    : () => inject(InventoryService).getBrands(),
                    categories: () => inject(InventoryService).getCategories(),
                    products  : () => inject(InventoryService).getProducts(),
                    tags      : () => inject(InventoryService).getTags(),
                    vendors   : () => inject(InventoryService).getVendors(),
                },

            },
            {
                path     : 'crear-dataset',
                component: CrearDatasetComponent,
            }
        ],
    },
] as Routes;
