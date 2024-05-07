import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProgressService } from 'app/core/progressBar/progressBar.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MtxProgress, MtxProgressType } from '@ng-matero/extensions/progress';

@Component({
  selector: 'app-progressdialog',
  template: `
<div class="w-96 h-32">
  <h2 mat-dialog-title>Generando...</h2>
  <mat-dialog-content>
  <mtx-progress [type]="'success'"
    [value]="progress"
    [striped]="'striped'" [animate]="'animate'"
    [height]="16 + 'px'"
    >
    {{16>=14 ? progress + '%' : ''}}
  </mtx-progress>  
</mat-dialog-content>
</div>
  `,
  standalone: true,
  imports: [MatProgressBarModule, MatDialogModule, MtxProgress],
})
export class ProgressDialogComponent implements OnInit {
  progress: number = 0;

  constructor(private progressService: ProgressService) { }

  ngOnInit(): void {
    this.progressService.getProgress().subscribe(progress => {
      this.progress = progress;
    });
  }
}