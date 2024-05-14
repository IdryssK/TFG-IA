import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import {MatSelectModule} from '@angular/material/select';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { translate, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  animations   : fuseAnimations,
  imports      : [RouterLink, MatSelectModule, TranslocoModule, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute,
              private _fuseConfirmationService: FuseConfirmationService,
              private router: Router,
              private translocoService: TranslocoService ) { } 

  
  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: '',
  };
  hasChanges: boolean = false;
  idx: any;
  showAlert: boolean = false;
  selected: any;
  usuario: {
    User_Email: string,
    User_Rol: number
    User_Idx: string,
    }
  public datosForm: FormGroup = this.fb.group({
    email: [ '', [Validators.required, Validators.email] ],
    password: [''],
    rol: ['', Validators.required ],
  });


  traducir(key: string): Observable<string> {
    return this.translocoService.selectTranslate(key, {});
}
  ngOnInit(): void {
    this.idx = this.route.snapshot.params['id'];
    this.getUser(this.idx);
  }


  update() {
    console.log(this.datosForm.pristine);
    this.datosForm.controls['email'].disable();
    this.datosForm.controls['password'].disable();
    this.datosForm.controls['rol'].disable();

    let updateData = this.datosForm.value;
  
    // Si el email, la contraseña o rol no se han modificado, elimina estos campos de los datos a enviar
    if(!this.datosForm.get('email')?.dirty) {
      delete updateData.email;
    }
    if(!this.datosForm.get('password')?.dirty) {
      delete updateData.password;
    }
    if(!this.datosForm.get('rol')?.dirty) {
      delete updateData.rol;
    }

    this.userService.updateUser(updateData, this.idx).subscribe(
      response => {
        console.log(response);
        this.showAlert = true;
                    this.alert.type = 'success';
                    this.alert.message = 'Se ha actualizado correctamente el usuario';
                    setTimeout(() => {
                        this.router.navigate(['/gestion-usuario']);
                    }, 1500);
      },
      error => {
        this.showAlert = true;
        this.alert.type = 'error';
        this.alert.message = error.error.msg;
        this.datosForm.controls['email'].enable();
        this.datosForm.controls['password'].enable();
      }
    );
  }

  getUser (idx) {
    this.userService.getUser(this.idx).subscribe(
      user => {
        this.datosForm.setValue({
          email: user.user.User_Email,
          password: '',
          rol: user.user.User_Rol.toString()
        });
        this.usuario = user.user;
        this.selected = user.user.User_Rol.toString();
      },
      (error) => {
        // Handle error here and set showAlert to true
        this.router.navigate(['/gestion-usuario']); 
        console.log(error);
      }
      );
  }


  cancelar() {
    console.log('cancelar')
    if(this.datosForm.pristine) {
      this.router.navigate(['/gestion-usuario']);
    } else {
      const confirmation = this._fuseConfirmationService.open({
            title  : 'Restablecer cambios',
            message: 'Estas seguro de que quieres restablecer los cambios? Se perderán los cambios no guardados.',
            actions: {
                confirm: {
                    label: 'Resablecer',
                },
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if ( result === 'confirmed' ) {  
              this.datosForm.reset();
              this.getUser(this.idx);
            }
        });
    }
  }
}
