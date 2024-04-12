import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MtxGrid, MtxGridColumn, MtxGridColumnButtonPop, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';

import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { translate, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FuseAlertService, FuseAlertComponent } from '@fuse/components/alert';
import { NavigationService } from 'app/core/navigation/navigation.service';

@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrl: './gestion-usuario.component.scss',
  standalone: true,
  imports: [NgIf, TranslocoModule,ReactiveFormsModule, FuseAlertComponent,LanguagesComponent, RouterLink, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, FormsModule, MtxGrid],
})
export class GestionUsuarioComponent implements OnInit{
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  

  constructor(private userService : UserService, private nav: NavigationService, private _fuseAlertService: FuseAlertService, private fb: FormBuilder, private transoloService: TranslocoService, private _fuseConfirmationService: FuseConfirmationService, private router: Router) {
  }
  ngOnInit(): void {
    this.getList();

    this.transoloService.langChanges$.subscribe(() => {
  
      let t = translate('user.operations');
      console.log(translate('user.operations'))
    });
    this._fuseAlertService.dismiss('error-delete-own-user');
    
  }

  rowClassFormatter: MtxGridRowClassFormatter = {
    admin: (data, index) => data.role === 'admin',
    usuario: (data, index) => data.role === 'usuario',
  };

  columns: MtxGridColumn[] = [
    { header: 'Idx', field: 'idx' },
    { header: 'Email', field: 'email' },
    { 
      header: 'Role', 
      field: 'role', 
      formatter: (data: any) => data.role === 'admin' ? `<span class="admin">${data.role}</span>` : `<span class="usuario">${data.role}</span>`
    },
    {
      header: translate('user.operations'),
      field: 'operation',
      width: '240px',
      pinned: 'right',
      right: '2px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          text: 'edit',
          icon: 'edit',
          class: 'success',
          tooltip: 'Edit',
          click: (row) => this.editar(row.idx),
        },
        {
          type: 'icon',
          text: 'delete',
          icon: 'delete',
          tooltip: 'Delete',
          color: 'warn',
          click: (row) => this.borrarUsuario(row.idx),
        },
      ],
    },
  ];

  searchForm = this.fb.group({
    searchQuery: ['']
  });
  lastSearch: any;

  list: any[] = [  ];
  isLoading: boolean;
  total: number = 0;

  query = {
    page: 0,
    per_page: 5,
    query:''
  };

  getList() {
    this.isLoading = true;
    // hacer llamada a userService.getUsers()
    this.userService.getAll(this.query).subscribe(data => {
      let userList = data.users.map(user => ({
        idx: user.User_Idx,
        email: user.User_Email,
        role: user.User_Rol === 1 ? 'admin' : 'usuario'
      }));
      // console.log(data.page.total)
      this.total = data.page.total;
      this.isLoading = false;
      
      // console.log(userList);
      this.list = userList;
    });
  }

  getNextPage(e: PageEvent) {
    console.log(e);
    
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
    console.log(this.query);
    this.getList();
  }
  
  editar(idx: number) {

    let idxLogged : any;
    this.userService.user$.subscribe((user) => {
      idxLogged = user.User_Idx;
    });
    if (idxLogged && idxLogged === idx) {
      // Show error message
      console.log('Cannot edit your own user');
      this._fuseAlertService.show('error-edit-own-user');
      setTimeout(() => {
        // this._fuseAlertService.dismiss('error-edit-own-user');
      }, 1500);
      console.log('Cannot edit your own user');
    } else {
      this.router.navigate(['/gestion-usuario/editar', idx]);
    }


    // this.router.navigate(['/gestion-usuario/editar', idx]);
  }
// this.router.navigate(['/gestion-usuario/editar', row.idx])
  borrarUsuario(idx: number) {

    let idxLogged : any;
    this.userService.user$.subscribe((user) => {
      idxLogged = user.User_Idx;
    });
    if(idxLogged === idx){
      this._fuseAlertService.show('error-delete-own-user');
      setTimeout(() => {
        // this._fuseAlertService.dismiss('error-delete-own-user');
      }, 1500);
      return;
    }
    else {
      
      const confirmation = this._fuseConfirmationService.open({
        title  : 'Eliminar usuario',
        message: '¿Estas seguro de que quieres eliminar el usuario?',
        actions: {
            confirm: {
                label: 'Eliminar',
            },
        },
      });
      confirmation.afterClosed().subscribe((result) => {
          // If the confirm button pressed...
          if ( result === 'confirmed' ) {  
            this.userService.deleteUser(idx).subscribe(
              () => {
                
                this.getList();
              },
              (error) => {
                console.error(error);
                // Handle the error here
              }
            );
          }
          else {
            console.log('no se ha eliminado el usuario');
          }
      });
    }
    // if (uid === this.userService.()) {
    //   Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes eliminar tu propio usuario',});
    //   return;
    // }
    
    
  }

  search(){
    // Se comprueba que el fomrulario este correcto
    if(!this.searchForm.valid){
      return;
    }

    this.lastSearch = '%' + this.searchForm.value.searchQuery + '%';
    this.query.query = this.lastSearch;
    this.getList();
  }

}
