import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Run } from 'src/app/models/run';
import { RunService } from 'src/app/services/run.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  displayedColumns: string[] = ['date', 'value', 'rate', 'frequency','rateConvert','time','view'];
  dataSource!: MatTableDataSource<Run>;
  show:boolean;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  runs:Run[]=[];
  runsUser:Run[]=[];
  constructor(private runService:RunService) {
    this.show=false;
    this.runService.getRuns().subscribe(
      (data)=>{
        this.runs=data;
        this.runs.forEach(
          (element:Run)=>{
          
            if(element.customer.id==localStorage.getItem("idCustomer")){
              this.runsUser.push(element);
            }
          }
        )
        this.dataSource = new MatTableDataSource(this.runsUser);
      }
    );
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  seleccionarCorrida(id:string){
    localStorage.setItem("idRun",id);
  
  }
  regresarAtras(salida:number){
    this.show=false;
  }
}
