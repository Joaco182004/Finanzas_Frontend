import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatCardModule,
    MatListModule,
    MatGridListModule
  ],
  exports:[
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatCardModule,
    MatListModule,
    MatGridListModule
  ]
})
export class ModulesModule { }
