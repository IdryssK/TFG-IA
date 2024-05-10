import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgIf,NgFor } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfig, FuseConfigService, Scheme, Theme, Themes } from '@fuse/services/config';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user',
    standalone     : true,
    imports        : [MatButtonModule, NgFor, FuseDrawerComponent, MatMenuModule, NgIf, MatIconModule, NgClass, MatDividerModule],
})
export class UserComponent implements OnInit, OnDestroy
{
    config: FuseConfig;
    layout: string;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = false;
    user: User;
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private _fuseConfigService: FuseConfigService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.user = user;
                // console.log(this.user);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
            // Subscribe to config changes
        this._fuseConfigService.config$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((config: FuseConfig) =>
        {
            // Store the config
            this.config = config;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void
    {
        // Return if user is not available
        if ( !this.user )
        {
            return;
        }

    }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }


    /**
     * Set the layout on the config
     *
     * @param layout
     */
    setLayout(layout: string): void
    {
        // Clear the 'layout' query param to allow layout changes
        this._router.navigate([], {
            queryParams        : {
                layout: null,
            },
            queryParamsHandling: 'merge',
        }).then(() =>
        {
            // Set the config
            this._fuseConfigService.config = {layout};
        });
    }
    /**
     * Set the scheme on the config
     *
     * @param scheme
     */
    setScheme(scheme: Scheme): void
    {
        this._fuseConfigService.config = {scheme};
    }

    /**
     * Set the theme on the config
     *
     * @param theme
     */
    setTheme(theme: Theme): void
    {
        this._fuseConfigService.config = {theme};
    }
}
