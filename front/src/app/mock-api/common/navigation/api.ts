import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { UserService } from 'app/core/user/user.service';
import { compactNavigation, defaultNavigationAdmin, futuristicNavigation, horizontalNavigationAdmin,defaultNavigationUser,horizontalNavigationUser} from 'app/mock-api/common/navigation/data';
import { cloneDeep } from 'lodash-es';

@Injectable({providedIn: 'root'})
export class NavigationMockApi
{
    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
    private readonly _defaultNavigationAdmin: FuseNavigationItem[] = defaultNavigationAdmin;
    private readonly _horizontalNavigationAdmin: FuseNavigationItem[] = horizontalNavigationAdmin;
    private readonly _defaultNavigationUser: FuseNavigationItem[] = defaultNavigationUser;
    private readonly _horizontalNavigationUser: FuseNavigationItem[] = horizontalNavigationUser;
    
    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private userService: UserService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------

        this.userService.user$.subscribe((user) => {

            if (user.User_Rol === 1) {
                this._fuseMockApiService
                .onGet('api/common/navigation')
                .reply(() =>
                {
                    // Fill horizontal navigation children using the default navigation
                    this._horizontalNavigationAdmin.forEach((horizontalNavItem) =>
                    {
                        this._defaultNavigationAdmin.forEach((defaultNavItem) =>
                        {
                            if ( defaultNavItem.id === horizontalNavItem.id )
                            {
                                horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                            }
                        });
                    });

                    // Return the response
                    return [
                        200,
                        {
                            compact   : cloneDeep(this._compactNavigation),
                            default   : cloneDeep(this._defaultNavigationAdmin),
                            futuristic: cloneDeep(this._futuristicNavigation),
                            horizontal: cloneDeep(this._horizontalNavigationAdmin),
                        },
                    ];
                });
            }
            else {
                this._fuseMockApiService
                .onGet('api/common/navigation')
                .reply(() =>
                {
                    // Fill horizontal navigation children using the default navigation
                    this._horizontalNavigationUser.forEach((horizontalNavItem) =>
                    {
                        this._defaultNavigationUser.forEach((defaultNavItem) =>
                        {
                            if ( defaultNavItem.id === horizontalNavItem.id )
                            {
                                horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                            }
                        });
                    });

                    // Return the response
                    return [
                        200,
                        {
                            compact   : cloneDeep(this._compactNavigation),
                            futuristic: cloneDeep(this._futuristicNavigation),
                            default   : cloneDeep(this._defaultNavigationUser),
                            horizontal: cloneDeep(this._horizontalNavigationUser),
                        },
                    ];
                });
            }
        
        });
    }
    
}
