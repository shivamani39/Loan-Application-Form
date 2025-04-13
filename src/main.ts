import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from './environments/environment';
import { JsonFormsAngularService } from '@jsonforms/angular';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    JsonFormsAngularService,
    { provide: 'enableObservables', useValue: true },
    { provide: 'ajv', useValue: {} }
  ]
}).catch(err => console.error(err));
