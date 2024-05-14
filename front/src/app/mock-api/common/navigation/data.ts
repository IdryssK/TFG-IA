/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { UserService } from 'app/core/user/user.service';


export const defaultNavigationAdmin: FuseNavigationItem[] = [
    {
        id   : 'configuraciones',
        title: 'CONFIGURATION',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/configuraciones',
    },
    {
        id   : 'datasets',
        title: 'DATASETS',
        type : 'basic',
        icon : 'heroicons_outline:circle-stack',
        link : '/datasets',
    },
    {
        id   : 'entrenamientos',
        title: 'TRAINING',
        type : 'basic',
        icon : 'heroicons_outline:bolt',
        link : '/entrenamientos'
    },
    {
        id   : 'algoritmos',
        title: 'ALGORITHMS',
        type : 'basic',
        icon : 'heroicons_outline:beaker',
        link : '/algoritmos'
    },
    {
        id   : 'gestion',
        title: 'USER MANAGEMENT',
        type : 'basic',
        icon : 'heroicons_outline:shield-check',
        link : '/gestion-usuario'
    }
];

export const horizontalNavigationAdmin: FuseNavigationItem[] = [
    {
        id   : 'configuraciones',
        title: 'CONFIGURATION',
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
        title: 'TRAINING',
        type : 'basic',
        icon : 'heroicons_outline:bolt',
        link : '/entrenamientos'
    },
    {
        id   : 'algoritmos',
        title: 'ALGORITHMS',
        type : 'basic',
        icon : 'heroicons_outline:beaker',
        link : '/algoritmos'
    },
    {
        id   : 'gestion',
        title: 'USER MANAGEMENT',
        type : 'basic',
        icon : 'heroicons_outline:shield-check',
        link : '/gestion-usuario'
    }
];
export const defaultNavigationUser: FuseNavigationItem[] = [
    {
        id   : 'configuraciones',
        title: 'CONFIGURATION',
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
        title: 'TRAINING',
        type : 'basic',
        icon : 'heroicons_outline:bolt',
        link : '/entrenamientos'
    },
    {
        id   : 'algoritmos',
        title: 'ALGORITHMS',
        type : 'basic',
        icon : 'heroicons_outline:beaker',
        link : '/algoritmos'
    }
];

export const horizontalNavigationUser: FuseNavigationItem[] = [
    {
        id   : 'configuraciones',
        title: 'CONFIGURATION',
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
        title: 'TRAINING',
        type : 'basic',
        icon : 'heroicons_outline:bolt',
        link : '/entrenamientos'
    },
    {
        id   : 'algoritmos',
        title: 'ALGORITHMS',
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