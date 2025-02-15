/*
 * Copyright (c) 2025 Alexandre Lorena
 * Licensed under the MIT License. See LICENSE file for details.
 */

// Angular Core e Básicos
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';

// Utilitários
import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// Componentes
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { MenuComponent } from './component/menu/menu.component';
import { MonthComponent } from './component/mes/month.component';
import { AddDespesaComponent } from './component/add-despesa/add-despesa.component';
import { ContentComponent } from './component/content/content.component';
import { FooterComponent } from './component/footer/footer.component';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { RepeatComponent } from './component/repeat/repeat.component';
import { EditDespesaModalComponent } from './edit-despesa-modal/edit-despesa-modal.component';

registerLocaleData(localePt, 'pt-BR');
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    MonthComponent,
    AddDespesaComponent,
    ContentComponent,
    FooterComponent,
    ConfirmationDialogComponent,
    RepeatComponent,
    EditDespesaModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    HttpClientModule,

    // Módulos do Angular Material
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ScrollingModule,

    // Módulos de Formulários
    ReactiveFormsModule,
    FormsModule,

    // Outros módulos
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    DatePipe,
    provideHttpClient(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
