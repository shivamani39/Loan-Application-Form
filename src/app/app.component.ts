import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonFormsModule, JsonFormsAngularService } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule, angularMaterialRenderers } from '@jsonforms/angular-material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
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
  JsonFormsCore,
  isControl, 
  VerticalLayout, 
  ControlProps, 
  Condition, 
  LabelElement, 
  HorizontalLayout 
} from '@jsonforms/core';
import { CustomAutocompleteControlRenderer as CustomInputComponent } from './custom.autocomplete';
import { parsePhoneNumber } from 'libphonenumber-js';

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
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  providers: [JsonFormsAngularService],
  template: `
    <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style="background-image: url('https://unsplash.com/photos/LeG68PrXA6Y/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzQ0NTM2NTQ2fA&force=true'); background-size: cover; background-position: center; background-repeat: no-repeat;">
      <div class="max-w-4xl mx-auto rounded-2xl shadow-2xl p-10 border border-gray-100" style="background: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('https://www.transparenttextures.com/patterns/diamond-upholstery.png'); backdrop-filter: blur(8px);">
        <div class="text-center mb-12">
          <h1 style="font-family: 'Playfair Display', serif;" class="text-6xl font-black bg-gradient-to-r from-indigo-600 via-blue-700 to-purple-700 text-transparent bg-clip-text mb-2 leading-tight tracking-tight">Loan Application</h1>
          <p style="font-family: 'Poppins', sans-serif;" class="text-gray-600 text-lg font-medium mt-4">Complete the form below to apply for your loan</p>
        </div>
        <div class="relative rounded-xl p-8" style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(124, 58, 237, 0.03) 100%), url('https://www.transparenttextures.com/patterns/clean-gray-paper.png'); border: 1px solid rgba(79, 70, 229, 0.1); box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.15);">
          <div class="absolute inset-0 backdrop-blur-[2px] rounded-xl z-0"></div>
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div style="font-family: 'Playfair Display', serif;" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold px-6 py-2 rounded-full shadow-lg">Personal Details</div>
          </div>
          <div class="relative z-10 mt-4">
          <jsonforms
            [data]="data"
            [schema]="schema"
            [uischema]="uischema"
            [renderers]="renderers"
            [readonly]="false"
            (dataChange)="onDataChange($event)"
            class="w-full"
          ></jsonforms>
          <div class="flex flex-col items-center mt-8 gap-4">
            <button
              mat-raised-button
              color="primary"
              (click)="handleSubmit()"
              class="px-8 py-4 text-lg min-w-[200px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-mdc-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    ::ng-deep .mat-mdc-card {
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    ::ng-deep .vertical-layout {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    ::ng-deep .horizontal-layout {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      flex-wrap: wrap;
    }
    ::ng-deep .horizontal-layout > * {
      flex: 1;
      min-width: 200px;
    }
    ::ng-deep .mat-mdc-checkbox {
      margin-bottom: 1rem;
    }
    ::ng-deep .mat-mdc-radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    ::ng-deep .group {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    ::ng-deep .group-label {
      font-size: 1.125rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 1rem;
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
        required: ['street', 'city', 'state', 'postalCode', 'country'],
        properties: {
          street: { 
            type: 'string',
            minLength: 5,
            maxLength: 100,
            title: 'Street Address',
            description: 'Enter your complete street address'
          },
          city: { 
            type: 'string',
            minLength: 2,
            pattern: '^[A-Za-z\\s-]+$',
            title: 'City',
            description: 'Enter your city name'
          },
          state: { 
            type: 'string',
            minLength: 2,
            pattern: '^[A-Za-z\\s-]+$',
            title: 'State/Province',
            description: 'Enter your state or province'
          },
          postalCode: { 
            type: 'string',
            pattern: '^[0-9]{5,6}$',
            title: 'Postal Code',
            description: 'Enter a valid 5-6 digit postal code'
          },
          country: { 
            type: 'string',
            minLength: 2,
            pattern: '^[A-Za-z\\s-]+$',
            title: 'Country',
            description: 'Enter your country name'
          }
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
      agreeToTerms: { 
          type: 'boolean',
          title: 'Terms and Conditions',
          description: 'Please read and accept our terms and conditions'
        }
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
        options: {
          showUnfocusedDescription: true
        },
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

  renderers = angularMaterialRenderers;

  isValid = false;
  touched = false;
  submitted = false;
  submittedData: any = null;
  ajv = createAjv();

  constructor(
    private jsonformsService: JsonFormsAngularService
  ) {}

  ngOnInit(): void {
    this.ajv.addFormat('time', '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');
    this.ajv.addFormat('tel', (maybePhoneNumber: string): boolean => this.validatePhoneNumber(maybePhoneNumber));
    
    this.jsonformsService.init({
      core: {
        data: this.data,
        schema: this.schema,
        uischema: this.uischema
      },
      renderers: angularMaterialRenderers
    });
  }

  onDataChange(event: JsonFormsCore): void {
    if (!event) return;

    this.data = event.data;
    this.touched = true;
    this.isValid = event.errors?.length === 0;

    // Log validation state
    console.log('Form validation:', {
      data: this.data,
      errors: event.errors,
      isValid: this.isValid
    });
  }

  handleSubmit(): void {
    // Show alert when form is submitted
    alert('Form submitted successfully!');
    
    // Log the submission
    console.log('Form submitted:', this.data);

    // Reset form
    this.data = {
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
    
    // Reset form immediately
    this.jsonformsService.init({
      core: {
        data: this.data,
        schema: this.schema,
        uischema: this.uischema
      },
      renderers: angularMaterialRenderers
    });
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
