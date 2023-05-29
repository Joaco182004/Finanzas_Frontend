import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './components/start/start.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { EngineComponent } from './components/engine/engine.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModulesModule } from './modules/modules.module';
import { HistoryComponent } from './components/history/history.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ShowhistoryComponent } from './components/showhistory/showhistory.component';
import { PruebaComponent } from './components/prueba/prueba.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    DashboardComponent,
    EngineComponent,
    HomeComponent,
    HistoryComponent,
    ShowhistoryComponent,
    PruebaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    BrowserAnimationsModule,
    ModulesModule,
    MatPaginatorModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

