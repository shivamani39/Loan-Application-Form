import { Component, OnInit } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { and, ControlProps, isControl, RankedTester, rankWith, isStringControl } from '@jsonforms/core';

@Component({
  selector: 'app-custom-input',
  standalone: false,
  template: `
    <div class="flex flex-col space-y-2">
      <label 
        [for]="id"
        class="block text-sm font-medium text-gray-700"
        [class.text-red-500]="!isValid">
        {{label}}
      </label>
      <input
        [id]="id"
        [type]="determineType()"
        [value]="data || ''"
        (input)="onChange($event)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        [class.border-red-500]="!isValid"
        [placeholder]="description || ''"
      />
      <div *ngIf="!isValid" class="text-red-500 text-xs mt-1">
        {{errorMessage}}
      </div>
    </div>
  `
})
export class CustomInputComponent extends JsonFormsControl implements OnInit {
  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  override getEventValue = (event: any) => event.target.value;

  override onChange(ev: any): void {
    this.data = this.getEventValue(ev);
  }

  get isValid(): boolean {
    return this.data !== undefined && (!this.error || this.error === '');
  }

  determineType(): string {
    const format = this.uischema?.options?.['format'];
    if (format) {
      switch (format) {
        case 'email': return 'email';
        case 'tel': return 'tel';
        case 'date': return 'date';
        default: return 'text';
      }
    }
    return 'text';
  }

  get errorMessage(): string {
    return this.error || '';
  }
}

export const customInputTester: RankedTester = rankWith(
  2,
  and(
    isControl,
    isStringControl
  )
);
