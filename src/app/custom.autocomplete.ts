import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { and, ControlProps, isControl, RankedTester, rankWith } from '@jsonforms/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-custom-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field class="w-full">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [formControl]="inputControl"
        [matAutocomplete]="auto"
        [placeholder]="description || ''"
        [id]="id"
      >
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onOptionSelected($event)">
        <mat-option *ngFor="let option of filteredOptions$ | async" [value]="option">
          {{ option }}
        </mat-option>
      </mat-autocomplete>
      <mat-error *ngIf="!isValid">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class CustomAutocompleteControlRenderer extends JsonFormsControl {
  inputControl = new FormControl('');
  options = ['Yes', 'No'];
  filteredOptions$: Observable<string[]>;

  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
    this.filteredOptions$ = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any): void {
    this.onChange(event.option.value);
  }

  override getEventValue = (event: any) => event.target.value;

  get errorMessage(): string {
    return this.error || '';
  }

  get isValid(): boolean {
    return !this.error || this.error === '';
  }
}
