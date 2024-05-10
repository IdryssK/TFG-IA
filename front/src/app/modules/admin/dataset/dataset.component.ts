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
import { DatasetsService } from 'app/core/datasets/datasets.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-dataset',
  standalone: true,
  templateUrl: './dataset.component.html',
  styleUrl: './dataset.component.scss',
  imports: [NgIf, TranslocoModule,ReactiveFormsModule , LanguagesComponent, RouterLink, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, FormsModule, MtxGrid],
})
export class DatasetComponent implements OnInit{
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  per_page: number = environment.per_page;
  per_page_options = environment.per_page_options;

  constructor(private http: HttpClient, private datasetService : DatasetsService, private fb: FormBuilder, private translocoService: TranslocoService, private _fuseConfirmationService: FuseConfirmationService, private router: Router) {
  }
  eliminado:boolean;
  ngOnInit(): void {
    this.getList();

    this.translocoService
      .selectTranslate("datasets.columns.configuration", {})
      .subscribe(console.log);
    
  }

  traducir(key: string): Observable<string> {
    return this.translocoService.selectTranslate(key, {});
  }

  columns: MtxGridColumn[] = [ 
    { header: '', field: 'prueba'},
    { header: 'Idx', field: 'DS_Idx', sortable: 'DS_Idx', sortProp: { id: 'DS_Idx', start: 'asc' }, type: 'number', pinned: 'left' },
    { header: this.traducir('datasets.columns.name'), field: 'CONF_Nombre' , sortable: 'CONF_Nombre', sortProp: { id: 'CONF_Nombre', start: 'asc' } , pinned: 'left' },
    { header: this.traducir('datasets.columns.file'), field: 'DS_Ruta', sortable: 'DS_Ruta', sortProp: { id: 'DS_Ruta', start: 'asc' }, pinned: 'left' },
    { header: this.traducir('datasets.columns.dicc'), field: 'DS_Ruta_Dic', sortable: 'DS_Ruta_Dic', sortProp: { id: 'DS_Ruta_Dic', start: 'asc' }, pinned: 'left'},
    { header: this.traducir('datasets.columns.date'), field: 'DS_Upd_When', sortable: 'DS_Upd_When', sortProp: { id: 'DS_Upd_When', start: 'asc' }, pinned: 'left'},
    {
      header: this.traducir('datasets.operations'),
      field: 'operation',
      width: '240px',
      pinned: 'right',
      right: '2px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          text: 'Download CSV',
          icon: 'table_view',
          color: 'primary',
          tooltip: 'Download CSV',
          click: (row) => this.dowloadDatasetCSV(row.DS_Idx),
        },
        {
          type: 'icon',
          text: 'Download JSON',
          icon: 'data_array',
          color: 'primary',
          tooltip: 'Download JSON',
          click: (row) => this.downloadDatasetJSON(row.DS_Idx),
        },
        {
          type: 'icon',
          text: 'delete',
          icon: 'delete',
          tooltip: 'Delete',
          color: 'warn',
          click: (row) => this.borrarDataset(row.DS_Idx),
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
    console.log(this.query);

    this.datasetService.getDatasets(this.query).subscribe(
      (response) => {
        console.log(response);
        let configList = response.datasets.map(config => ({
          DS_Idx: config.DS_Idx,
          CONF_Nombre: config.DS_Nombre,
          DS_Ruta: config.DS_Ruta.split('/').pop(),
          DS_Ruta_Dic: config.DS_Ruta_Dic.split('/').pop(),
          DS_Upd_When: config.DS_Upd_When,
        }));
        this.list = configList;
        this.total = response.page.total;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  
  }

  getNextPage(e: PageEvent) {
    console.log(e);
    
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
    console.log(this.query);
    this.getList();
  }
  
  borrarDataset(idx: number) {
    // if (uid === this.userService.()) {
    //   Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes eliminar tu propio usuario',});
    //   return;
    // }
    const confirmation = this._fuseConfirmationService.open({
      title  : 'Eliminar dataset',
      message: '¿Estas seguro de que quieres eliminar el dataset?',
      actions: {
          confirm: {
              label: 'Eliminar',
          },
      },
    });
    confirmation.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if ( result === 'confirmed' ) {  
          this.datasetService.deleteDataset(idx).subscribe(
            () => {
              
              this.getList();
              this.eliminado = true;
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
  dowloadDatasetCSV(idx) {
    console.log(idx)
    this.datasetService.getDataset(parseInt(idx)).subscribe(dataset => {
      console.log(dataset)
      const url = dataset.dataset.DS_Ruta.split('src')[1]; // Assumes that getDataset returns an object with a DS_Ruta property

      if (!url) {
        console.error('URL no existe');
        return;
      }

      this.http.get(url, { responseType: 'blob' }).subscribe((res: any) => {
        const blob = new Blob([res], { type: 'text/csv' }); // Creates a blob with the data
        saveAs(blob, `${dataset.dataset.DS_Ruta.split('/').pop()}`); // Uses the file-saver library to download the file
      });
    });
  }
  downloadDatasetJSON(idx) {
    console.log(idx)
    this.datasetService.getDataset(parseInt(idx)).subscribe(dataset => {
      console.log(dataset)
      const url = dataset.dataset.DS_Ruta_Dic.split('src')[1]; // Use the full DS_Ruta_Dic property as the URL

      if (!url) {
        console.error('URL no existe');
        return;
      }

      this.http.get(url, { responseType: 'blob' }).subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/json' }); // Creates a blob with the data
        saveAs(blob, `${dataset.dataset.DS_Ruta_Dic.split('/').pop()}`); // Use DS_Ruta_Dic to generate the downloaded file name
      });
    });
  }

}
