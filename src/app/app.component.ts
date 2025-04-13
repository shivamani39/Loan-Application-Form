import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonFormsModule, JsonFormsAngularService } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule, angularMaterialRenderers } from '@jsonforms/angular-material';
import { 
  createAjv, 
  JsonSchema, 
  Layout, 
  JsonFormsRendererRegistryEntry, 
  ControlElement, 
  GroupLayout, 
  RuleEffect, 
  RankedTester, 
  schemaTypeIs, 
  scopeEndsWith, 
  and, 
  rankWith, 
  optionIs, 
  isControl, 
  VerticalLayout, 
  ControlProps, 
  Condition, 
  JsonFormsCore, 
  LabelElement, 
  HorizontalLayout 
} from '@jsonforms/core';
import { CustomAutocompleteControlRenderer as CustomInputComponent } from './custom.autocomplete';
import { parsePhoneNumber } from 'libphonenumber-js';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface LoanApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  existingCustomer: boolean;
  customerNumber?: string;
  loanType: string;
  loanAmount: number;
  address: Address;
  businessAddress: Address;
  agreeToTerms: boolean;
}

const departmentTester: RankedTester = rankWith(5, and(
  schemaTypeIs('string'),
  scopeEndsWith('department')
));

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    MatInputModule
  ],
  template: `
    <div class="container">
      <h1>Loan Application Form</h1>
      <jsonforms
        [data]="data"
        [schema]="schema"
        [uischema]="uischema"
        [renderers]="renderers"
        [ajv]="ajv"
        (dataChange)="onDataChange($event)"
      ></jsonforms>
      <button
        [disabled]="!isValid || submitted"
        (click)="handleSubmit()"
      >
        Submit Application
      </button>
      <div *ngIf="submitted">
        <h2>Form Submitted Successfully!</h2>
        <pre>{{ submittedData | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #333;
      margin-bottom: 30px;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    pre {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }
  `]
})
export class AppComponent implements OnInit {
  data: LoanApplicationData = {
    firstName: '',
    lastName: '',
    email: '',
    existingCustomer: false,
    customerNumber: '',
    loanType: '',
    loanAmount: 0,
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    businessAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    agreeToTerms: false
  };

  schema: JsonSchema = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'loanType', 'agreeToTerms'],
    properties: {
      firstName: { type: 'string', minLength: 2 },
      lastName: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      existingCustomer: { type: 'boolean' },
      customerNumber: { type: 'string', minLength: 5 },
      loanType: {
        type: 'string',
        enum: ['personal', 'business', 'mortgage', 'auto']
      },
      loanAmount: { type: 'number', minimum: 1000 },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          postalCode: { type: 'string' },
          country: { type: 'string' }
        }
      },
      businessAddress: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          postalCode: { type: 'string' },
          country: { type: 'string' }
        }
      },
      agreeToTerms: { type: 'boolean' }
    }
  };

  uischema: Layout = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/firstName',
            label: 'First Name'
          } as ControlElement,
          {
            type: 'Control',
            scope: '#/properties/lastName',
            label: 'Last Name'
          } as ControlElement
        ]
      } as HorizontalLayout,
      {
        type: 'Control',
        scope: '#/properties/email',
        label: 'Email Address'
      } as ControlElement,
      {
        type: 'Control',
        scope: '#/properties/existingCustomer',
        label: 'Are you an existing customer?'
      } as ControlElement,
      {
        type: 'Control',
        scope: '#/properties/customerNumber',
        label: 'Customer Number',
        rule: {
          effect: RuleEffect.SHOW,
          condition: {
            scope: '#/properties/existingCustomer',
            schema: { const: true }
          }
        }
      } as ControlElement,
      {
        type: 'Control',
        scope: '#/properties/loanType',
        label: 'Type of Loan'
      } as ControlElement,
      {
        type: 'Control',
        scope: '#/properties/loanAmount',
        label: 'Loan Amount'
      } as ControlElement,
      {
        type: 'Group',
        label: 'Residential Address',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/address/properties/street',
            label: 'Street Address'
          } as ControlElement,
          {
            type: 'HorizontalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/address/properties/city',
                label: 'City'
              } as ControlElement,
              {
                type: 'Control',
                scope: '#/properties/address/properties/state',
                label: 'State'
              } as ControlElement,
              {
                type: 'Control',
                scope: '#/properties/address/properties/postalCode',
                label: 'Postal Code'
              } as ControlElement
            ]
          } as HorizontalLayout,
          {
            type: 'Control',
            scope: '#/properties/address/properties/country',
            label: 'Country'
          } as ControlElement
        ]
      } as GroupLayout,
      {
        type: 'Control',
        scope: '#/properties/agreeToTerms',
        label: 'I agree to the Terms and Conditions'
      } as ControlElement
    ]
  };

  renderers: JsonFormsRendererRegistryEntry[] = [
    ...angularMaterialRenderers,
    { tester: departmentTester, renderer: CustomInputComponent }
  ];

  isValid = false;
  touched = false;
  submitted = false;
  submittedData: any = null;
  ajv = createAjv();

  constructor(
    private jsonformsService: JsonFormsAngularService,
    @Inject(MAT_DATE_LOCALE) private locale: string,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale(this.locale);
  }

  ngOnInit(): void {
    this.ajv.addFormat('time', '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');
    this.ajv.addFormat('tel', (maybePhoneNumber: string): boolean => this.validatePhoneNumber(maybePhoneNumber));
  }

  onDataChange(event: JsonFormsCore): void {
    if (event && event.data) {
      this.data = event.data;
      this.isValid = !event.errors || event.errors.length === 0;
      this.touched = true;
    }
  }

  handleSubmit(): void {
    if (this.isValid && this.data) {
      this.submitted = true;
      this.submittedData = { ...this.data };
      console.log('Form submitted:', this.data);
    }
  }

  private validatePhoneNumber(maybePhoneNumber: string): boolean {
    try {
      parsePhoneNumber(maybePhoneNumber, 'DE');
      return true;
    } catch (_) {
      return false;
    }
  }
}
