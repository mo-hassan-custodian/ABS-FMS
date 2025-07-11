import { Component, OnInit } from '@angular/core';
import { AuthorizedFileTransferService } from '../../services/authorized-file-transfer.service';
import { BankAccountService } from '../../services/bank-account.service';
import { AuthorizedFileTransfer } from '../../models/authorized-file-transfer.model';
import { BankAccount } from '../../models/bank-account.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-api-test',
  template: `
    <div class="api-test-container">
      <h2>API Connection Test</h2>

      <div class="test-section">
        <h3>Configuration Info</h3>
        <div class="config-info">
          <p>
            <strong>API Base URL:</strong>
            {{ apiBaseUrl || 'Using proxy (relative URLs)' }}
          </p>
          <p><strong>Expected Endpoint:</strong> {{ fullApiUrl }}</p>
          <p>
            <strong>Proxy Status:</strong>
            {{ proxyEnabled ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
      </div>

      <div class="test-section">
        <h3>Test API Connection</h3>
        <button (click)="testApiConnection()" [disabled]="loading">
          {{ loading ? 'Testing...' : 'Test API' }}
        </button>

        <div
          *ngIf="apiStatus"
          class="status-message"
          [ngClass]="apiStatus.type"
        >
          {{ apiStatus.message }}
        </div>

        <div *ngIf="apiStatus?.type === 'error'" class="troubleshooting">
          <h4>Troubleshooting Steps:</h4>
          <ol>
            <li>
              <strong>CORS Error?</strong> Add CORS headers to your backend:
              <br /><code
                >Access-Control-Allow-Origin: http://localhost:4200</code
              >
              <br />See <code>CORS_SETUP.md</code> for framework-specific
              examples
            </li>
            <li>
              Check if your ngrok tunnel is running:
              <code>ngrok http 8080</code> (or your backend port)
            </li>
            <li>Verify your backend API is running and accessible</li>
            <li>
              Update the ngrok URL in
              <code>src/environments/environment.ts</code>
            </li>
            <li>Test the ngrok URL directly in your browser</li>
            <li>Check browser console for detailed error messages</li>
            <li>Restart the Angular dev server: <code>ng serve</code></li>
          </ol>
        </div>
      </div>

      <div class="test-section">
        <h3>Test Bank Accounts API</h3>
        <button
          (click)="testBankAccountsApi()"
          [disabled]="bankAccountsLoading"
        >
          {{ bankAccountsLoading ? 'Testing...' : 'Test Bank Accounts API' }}
        </button>

        <div
          *ngIf="bankAccountsStatus"
          class="status-message"
          [ngClass]="bankAccountsStatus.type"
        >
          {{ bankAccountsStatus.message }}
        </div>
      </div>

      <div class="test-section" *ngIf="bankAccounts.length > 0">
        <h3>Bank Accounts Data ({{ bankAccounts.length }} accounts)</h3>
        <div class="transfers-list">
          <div
            *ngFor="let account of bankAccounts.slice(0, 5)"
            class="transfer-item"
          >
            <strong>{{ account.accountNumber }}</strong> -
            {{ account.accountName }} - {{ account.bankName }} <br /><small>{{
              account.name
            }}</small>
          </div>
          <div *ngIf="bankAccounts.length > 5" class="more-items">
            ... and {{ bankAccounts.length - 5 }} more accounts
          </div>
        </div>
      </div>

      <div class="test-section" *ngIf="transfers.length > 0">
        <h3>API Data ({{ transfers.length }} records)</h3>
        <div class="transfers-list">
          <div
            *ngFor="let transfer of transfers.slice(0, 5)"
            class="transfer-item"
          >
            <strong>{{ transfer.id }}</strong> - {{ transfer.payee }} -
            {{ transfer.amountPayee | currency : 'NGN' }}
          </div>
          <div *ngIf="transfers.length > 5" class="more-items">
            ... and {{ transfers.length - 5 }} more items
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .api-test-container {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }

      .test-section {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }

      .status-message {
        margin-top: 10px;
        padding: 10px;
        border-radius: 3px;
      }

      .status-message.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      .status-message.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }

      .transfer-item {
        padding: 5px 0;
        border-bottom: 1px solid #eee;
      }

      .more-items {
        padding: 10px 0;
        font-style: italic;
        color: #666;
      }

      button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }

      button:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
      }

      .config-info p {
        margin: 5px 0;
        font-family: monospace;
        font-size: 14px;
      }

      .troubleshooting {
        margin-top: 15px;
        padding: 15px;
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 5px;
      }

      .troubleshooting h4 {
        margin-top: 0;
        color: #856404;
      }

      .troubleshooting ol {
        margin: 10px 0;
        padding-left: 20px;
      }

      .troubleshooting li {
        margin: 8px 0;
      }

      .troubleshooting code {
        background-color: #f8f9fa;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: monospace;
      }
    `,
  ],
})
export class ApiTestComponent implements OnInit {
  transfers: AuthorizedFileTransfer[] = [];
  bankAccounts: BankAccount[] = [];
  loading = false;
  bankAccountsLoading = false;
  apiStatus: { type: 'success' | 'error'; message: string } | null = null;
  bankAccountsStatus: { type: 'success' | 'error'; message: string } | null =
    null;

  // Configuration properties for display
  apiBaseUrl = environment.apiBaseUrl;
  fullApiUrl = `${environment.apiBaseUrl}/api/Authorization`;
  proxyEnabled = false; // No longer using proxy

  constructor(
    private transferService: AuthorizedFileTransferService,
    private bankAccountService: BankAccountService
  ) {}

  ngOnInit() {
    // Auto-test on component load
    this.testApiConnection();
  }

  testApiConnection() {
    this.loading = true;
    this.apiStatus = null;

    this.transferService.getAllTransfers().subscribe({
      next: (response) => {
        this.transfers = response.records;
        this.loading = false;

        // Check if we got data from API
        const isFromAPI = response.totalRecords > 0;

        this.apiStatus = {
          type: 'success',
          message: isFromAPI
            ? `✅ API connection successful! Loaded ${response.totalRecords} transfers from API (Page ${response.pageNumber} of ${response.totalPages}).`
            : `⚠️ No data available. API returned empty result.`,
        };
      },
      error: (error) => {
        this.loading = false;

        // Provide more detailed error information
        let errorMessage = '❌ API connection failed: ';

        if (error.status === 0) {
          if (error.message && error.message.includes('CORS')) {
            errorMessage +=
              'CORS error - your backend needs CORS headers for http://localhost:4200';
          } else {
            errorMessage +=
              'Network error - ngrok tunnel may be offline or CORS issue';
          }
        } else if (error.status === 404) {
          errorMessage +=
            'API endpoint not found (404) - check if your backend implements the expected routes';
        } else if (error.status >= 500) {
          errorMessage += 'Server error - check your backend logs';
        } else {
          errorMessage += `${error.status} - ${
            error.message || 'Unknown error'
          }`;
        }

        this.apiStatus = {
          type: 'error',
          message: errorMessage,
        };

        console.error('API Test Error Details:', {
          status: error.status,
          message: error.message,
          url: error.url,
          error: error,
        });
      },
    });
  }

  testBankAccountsApi() {
    this.bankAccountsLoading = true;
    this.bankAccountsStatus = null;

    this.bankAccountService.getBankAccounts().subscribe({
      next: (bankAccounts: BankAccount[]) => {
        this.bankAccounts = bankAccounts;
        this.bankAccountsLoading = false;

        this.bankAccountsStatus = {
          type: 'success',
          message: `✅ Bank Accounts API successful! Loaded ${bankAccounts.length} bank accounts.`,
        };
      },
      error: (error: any) => {
        this.bankAccountsLoading = false;
        console.error('Bank Accounts API call failed:', error);

        let errorMessage = '❌ Bank Accounts API connection failed: ';
        if (error.status === 0) {
          errorMessage +=
            'Network error - check if backend is running and CORS is configured';
        } else {
          errorMessage += `${error.status} - ${
            error.message || 'Unknown error'
          }`;
        }

        this.bankAccountsStatus = {
          type: 'error',
          message: errorMessage,
        };

        console.error('Bank Accounts API Error Details:', {
          status: error.status,
          message: error.message,
          url: error.url,
          error: error,
        });
      },
    });
  }
}
