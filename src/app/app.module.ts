import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { AppComponent } from './app.component';
import { CustomAutocompleteControlRenderer } from './custom.autocomplete';
import { DataDisplayComponent } from './data.control';
import { LangComponent } from './lang.control';
import { CustomInputComponent, customInputTester } from './custom-input.component';


@NgModule({
  declarations: [
    DataDisplayComponent,
    LangComponent,
    CustomInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    CustomAutocompleteControlRenderer
  ],
  schemas: [],
  providers: [
    { provide: 'custom-input', useValue: { renderer: CustomInputComponent, tester: customInputTester } }
  ]
})
export class AppModule {
}
