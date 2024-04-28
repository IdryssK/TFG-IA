import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
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
import { NgIf } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { translate, TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dataset',
  standalone: true,
  templateUrl: './dataset.component.html',
  styleUrl: './dataset.component.scss',
  imports: [NgIf, TranslocoModule,ReactiveFormsModule , LanguagesComponent, RouterLink, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, FormsModule, MtxGrid],
})
export class DatasetComponent implements OnInit{
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  

  constructor(private userService : UserService, private fb: FormBuilder, private transoloService: TranslocoService, private _fuseConfirmationService: FuseConfirmationService, private router: Router) {
  }
  ngOnInit(): void {
    //this.getList();

    this.transoloService.langChanges$.subscribe(() => {
  
      let t = translate('user.operations');
      console.log(translate('user.operations'))
    });
    
  }


  columns: MtxGridColumn[] = [  ];

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
  
  }

  getNextPage(e: PageEvent) {
    console.log(e);
    
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
    console.log(this.query);
    this.getList();
  }
  
  borrarUsuario(idx: number) {
    console.log(this.userService.get());
    // if (uid === this.userService.()) {
    //   Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes eliminar tu propio usuario',});
    //   return;
    // }
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
