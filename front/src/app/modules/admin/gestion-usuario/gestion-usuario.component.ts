import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MtxGrid, MtxGridColumn, MtxGridColumnButtonPop } from '@ng-matero/extensions/grid';

import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrl: './gestion-usuario.component.scss',
  standalone: true,
  imports: [RouterLink, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, FormsModule, MtxGrid],
})
export class GestionUsuarioComponent implements OnInit{
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  constructor(private userService : UserService, private router: Router) {
  }
  ngOnInit(): void {
    
    // hacer llamada a userService.getUsers()
    this.userService.getAll().subscribe(users => {
      let userList = users.users.map(user => ({
        idx: user.User_Idx,
        email: user.User_Email,
        role: user.User_Rol === 1 ? 'admin' : 'usuario'
      }));
      
      console.log(userList);
      this.list = userList;
    });

  }

  popDelete : MtxGridColumnButtonPop = {
    title: 'Borrar usuario',
    description: '¿Estás seguro de que quieres borrar este usuario?',
    closeColor: 'primary',
    closeText: 'Cancelar',
    okColor: 'warn',
    okText: 'Borrar',
  };

  columns: MtxGridColumn[] = [
    { header: 'Idx', field: 'idx' },
    { header: 'Email', field: 'email' },
    { header: 'Role', field: 'role', class: 'role-column'},
    {
      header: 'Operation',
      field: 'operation',
      width: '240px',
      pinned: 'right',
      right: '2px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          text: 'copy',
          icon: 'file_copy',
          tooltip: 'copy',
          disabled: false,
          click: () => this.router.navigate(['/gestion-usuario']),
        },
        {
          type: 'icon',
          text: 'edit',
          icon: 'edit',
          tooltip: 'Edit',
          click: (row) => this.router.navigate(['/gestion-usuario/editar', row.idx]),
        },
        {
          type: 'icon',
          text: 'delete',
          icon: 'delete',
          tooltip: 'Delete',
          color: 'warn',
          pop: this.popDelete,
          click: () => alert('delete'),
          badge: {
            content: 12,
            size: 'small',
          },
        },
      ],
    },
  ];

  
  list: any[] = [  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

}
