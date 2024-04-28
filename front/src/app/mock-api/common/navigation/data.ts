/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { UserService } from 'app/core/user/user.service';


export const defaultNavigationAdmin: FuseNavigationItem[] = [
    {
        id   : 'configuraciones',
        title: 'CONFIGURACIONES',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/configuraciones',
    },
    {
        id   : 'datasets',
        title: 'DATASETS',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/datasets',
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

export const horizontalNavigationAdmin: FuseNavigationItem[] = [
    {
        id   : 'configuraciones',
        title: 'CONFIGURACIONES',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/configuraciones',
    },
    {
        id   : 'datasets',
        title: 'DATASETS',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/datasets',
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
export const defaultNavigationUser: FuseNavigationItem[] = [
    {
        id   : 'configuraciones',
        title: 'CONFIGURACIONES',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/configuraciones',
    },
    {
        id   : 'datasets',
        title: 'DATASETS',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/datasets',
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
    }
];

export const horizontalNavigationUser: FuseNavigationItem[] = [
    {
        id   : 'configuraciones',
        title: 'CONFIGURACIONES',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/configuraciones',
    },
    {
        id   : 'datasets',
        title: 'DATASETS',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/datasets',
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