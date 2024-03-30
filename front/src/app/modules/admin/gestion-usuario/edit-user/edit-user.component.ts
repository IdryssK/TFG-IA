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

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports      : [RouterLink, MatSelectModule, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { } 
  idx: any;
  showAlert: boolean = false;
  selected: any;
  public datosForm: FormGroup = this.fb.group({
    email: [ '', [Validators.required, Validators.email] ],
    password: ['', Validators.required],
    rol: ['', Validators.required ],
  });

  ngOnInit(): void {
    this.idx = this.route.snapshot.params['id'];
    
    // llamar a la funcion userSerice.getUser(this.idx)
    console.log(this.idx);
    this.userService.getUser(this.idx).subscribe(
      user => {
        console.log(user);
        this.datosForm.setValue({
          email: user.user.User_Email,
          password: 'sdsds',
          rol: user.user.User_Rol
        });
        console.log(user.user.User_Rol);
        this.selected = user.user.User_Rol.toString();
      },
      error => {
        // Handle error here and set showAlert to true
        console.log(error);
        this.showAlert = true;
      }
    );
  }


  update() {

  }
}
