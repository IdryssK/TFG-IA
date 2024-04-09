/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'configuracion',
        title: 'CONFIGURACION',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/configuracion',
    },
    {
        id   : 'dataset',
        title: 'DATASET',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dataset',
    },
    {
        id   : 'entrenamientos',
        title: 'ENTRENAMIENTOS',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/entrenamientos'
    },
    {
        id   : 'algoritmos',
        title: 'ALGORITMOS',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/algoritmos'
    },
    {
        id   : 'gestion',
        title: 'GESTION USUARIOS',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/gestion-usuario'
    }
];

export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'configuracion',
        title: 'CONFIGURACION',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/configuracion',
    },
    {
        id   : 'dataset',
        title: 'DATASET',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dataset',
    },
    {
        id   : 'entrenamientos',
        title: 'ENTRENAMIENTOS',
        type : 'basic',
        icon : 'heroicons_outline:bolt',
        link : '/example2'
    },
    {
        id   : 'algoritmos',
        title: 'ALGORITMOS',
        type : 'basic',
        icon : 'heroicons_outline:beaker',
        link : '/algoritmos'
    },
    {
        id   : 'gestion',
        title: 'GESTION USUARIOS',
        type : 'basic',
        icon : 'heroicons_outline:shield-check',
        link : '/gestion-usuario'
    }
];


export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];