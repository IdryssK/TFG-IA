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
import { ConfiguracionesService } from 'app/core/configuraciones/configuraciones.service';
import { FuseAlertComponent, FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-configuraciones',
  standalone: true,
  templateUrl: './configuraciones.component.html',
  styleUrl: './configuraciones.component.scss',
  imports: [FuseAlertComponent, NgIf, TranslocoModule,ReactiveFormsModule , LanguagesComponent, RouterLink, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, FormsModule, MtxGrid],
})
export class ConfiguracionesComponent implements OnInit{
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  per_page: number = environment.per_page;
  per_page_options = environment.per_page_options;
  eliminado: boolean;
  constructor(private _fuseAlertService: FuseAlertService, private userService : UserService, private configService: ConfiguracionesService, private fb: FormBuilder, private transoloService: TranslocoService, private _fuseConfirmationService: FuseConfirmationService, private router: Router) {}
  
  ngOnInit(): void {
    this.getList();

    this.transoloService.langChanges$.subscribe(() => {
  
      let t = translate('user.operations');
      console.log(translate('user.operations'))
    });
    
  }


  columns: MtxGridColumn[] = [
    { header: '', field: 'prueba'},
    { header: 'Idx', field: 'idx', sortable: 'idx', sortProp: { id: 'idx', start: 'asc' }, type: 'number' , pinned: 'left'},
    { header: 'Nombre', field: 'nombre', sortable: 'nombre', sortProp: { id: 'nombre', start: 'asc' }, pinned: 'left'},
    { header: 'Ultima modificación', field: 'updWhen', sortable: 'updWhen', sortProp: { id: 'updWhen', start: 'asc' }, pinned: 'left'},
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
          text: 'copy',
          icon: 'file_copy',
          // color: 'primary',
          // class: 'success',
          color: 'success',
          tooltip: 'Copy',
          click: (row) => this.copiarConfiguracion(row.idx),
        },
        {
          type: 'icon',
          text: 'edit',
          icon: 'edit',
          class: 'success',
          tooltip: 'Edit',
          click: (row) => this.router.navigate(['configuraciones/configuracion', row.idx]),
        },
        {
          type: 'icon',
          text: 'delete',
          icon: 'delete',
          tooltip: 'Delete',
          color: 'warn',
          click: (row) => this.borrarConfiguracion(row.idx),
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
    per_page: this.per_page,
    query:''
  };

  getList() {
    this.isLoading = true;
    // hacer llamada a userService.getUsers()
    console.log(this.query)
    this.configService.configuracionList(this.query).subscribe(data => {
      console.log(data);
      let configList = data.configuraciones.map(config => ({
        idx: config.CONF_Idx,
        nombre: config.CONF_Nombre,
        updWhen: config.CONF_Upd_When
      }));
      this.total = data.page.total;
      this.isLoading = false;
      this.list = configList;
    });

    // this.userService.getAll(this.query).subscribe(data => {
    //   let userList = data.users.map(user => ({
    //     idx: user.User_Idx,
    //     email: user.User_Email,
    //     role: user.User_Rol === 1 ? 'admin' : 'usuario'
    //   }));
    //   console.log(data.page.total)
    //   this.total = data.page.total;
    //   this.isLoading = false;
      
    //   console.log(userList);
    //   this.list = userList;
    // });
  }

  getNextPage(e: PageEvent) {
    console.log(e);
    
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
    console.log(this.query);
    this.getList();
  }
  
  borrarConfiguracion(idx: number) {
    
    const confirmation = this._fuseConfirmationService.open({
      title  : 'Eliminar configuración',
      message: '¿Estas seguro de que quieres eliminar la configuración?',
      actions: {
          confirm: {
              label: 'Eliminar',
          },
      },
    });
    confirmation.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if ( result === 'confirmed' ) {  
          this.configService.deleteConfiguracion(idx).subscribe(data => {
            console.log(data);
            this.getList();
            this.eliminado = true;
          });
        }
        else {
          console.log('no se ha eliminado el usuario');
        }
    });
    
  }

  copiarConfiguracion(idx: number) {
    console.log('copiar configuracion');
    let copyData;
    this.configService.getConfiguracion(idx).subscribe(data => {
      copyData = JSON.parse(data.configuracion.CONF_Data);
    
    copyData.nombre = copyData.nombre + '_copia_idx_' + idx;

    // copyData.CONF_Nombre = copyData.CONF_Nombre + ' - copia';
    console.log(copyData);
    this.configService.copyConfiguracion(copyData).subscribe(data => {
      console.log(data);
      this.router.navigate(['configuraciones/configuracion', data.resultado]);
    });
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
