import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { MenuComponent } from './component/menu/menu.component';
import { MonthComponent } from './component/mes/month.component';
import { AddDespesaComponent } from './component/add-despesa/add-despesa.component';
import { ContentComponent } from './component/content/content.component';
import { FooterComponent } from './component/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient } from '@angular/common/http'; // Atualize para esta importação
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DespesasComponent } from './component/despesas/despesas.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmationDialogComponent } from './../app/component/confirmation-dialog/confirmation-dialog.component';
import { RepeatComponent } from './component/repeat/repeat.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    MonthComponent,
    AddDespesaComponent,
    ContentComponent,
    FooterComponent,
    DespesasComponent,
    ConfirmationDialogComponent,
    RepeatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule,

    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
  ],
  providers: [DatePipe, provideAnimationsAsync(), provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
