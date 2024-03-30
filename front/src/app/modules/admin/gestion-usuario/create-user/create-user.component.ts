import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Component({
    selector     : 'app-create-user',
    templateUrl  : './create-user.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class CreateUserComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private authService: AuthService,
        private router: Router
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
        // Create the form
        this.signUpForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
                },
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    create(): void {
        this.signUpForm.controls['email'].disable();
        this.signUpForm.controls['password'].disable();
        console.log(this.signUpForm.disabled);
        
        this.authService.signUp({ email: this.signUpForm.value.email, password: this.signUpForm.value.password })
            .subscribe(
                (data) => {
                    // Success
                    console.log(data    )
                    this.showAlert = true;
                    this.alert.type = 'success';
                    this.alert.message = 'User created successfully.';
                    setTimeout(() => {
                        this.router.navigate(['/gestion-usuario']);
                    }, 1500);
                },
                (error) => {
                    // Error
                    console.log(error);
                    this.showAlert = true;
                    this.alert.type = 'error';
                    this.alert.message = error.error.msg;
                    this.signUpForm.controls['email'].enable();
                    this.signUpForm.controls['password'].enable();
                }
            );
    }


}
