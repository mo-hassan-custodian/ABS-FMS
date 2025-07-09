import { Component, OnInit } from '@angular/core';
import { AuthorizedFileTransferService } from '../../services/authorized-file-transfer.service';
import { AuthorizedFileTransfer } from '../../models/authorized-file-transfer.model';

@Component({
  selector: 'app-api-test',
  template: `
    <div class="api-test-container">
      <h2>API Connection Test</h2>

      <div class="test-section">
        <h3>Configuration Info</h3>
        <div class="config-info">
          <p>
            <strong>Data Source:</strong>
            Local Mock Data (No API calls)
          </p>
          <p><strong>Status:</strong> Using in-memory data storage</p>
        </div>
      </div>

      <div class="test-section">
        <h3>Test Local Data</h3>
        <button (click)="testLocalData()" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Load Mock Data' }}
        </button>

        <div
          *ngIf="dataStatus"
          class="status-message"
          [ngClass]="dataStatus.type"
        >
          {{ dataStatus.message }}
        </div>

        <div *ngIf="dataStatus?.type === 'error'" class="troubleshooting">
          <h4>Troubleshooting Steps:</h4>
          <ol>
            <li>
              <strong>Check Browser Console:</strong> Open Developer Tools (F12)
              and check the Console tab for detailed error messages.
            </li>
            <li>
              <strong>Local Storage:</strong> Data is stored in browser's
              localStorage. Clear it if you encounter issues.
            </li>
            <li>Restart the Angular dev server: <code>ng serve</code></li>
          </ol>
        </div>
      </div>

      <div class="test-section" *ngIf="transfers.length > 0">
        <h3>Mock Data ({{ transfers.length }} records)</h3>
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
  loading = false;
  dataStatus: { type: 'success' | 'error'; message: string } | null = null;

  constructor(private transferService: AuthorizedFileTransferService) {}

  ngOnInit() {
    // Auto-load mock data on component load
    this.testLocalData();
  }

  testLocalData() {
    this.loading = true;
    this.dataStatus = null;

    this.transferService.getAllTransfers().subscribe({
      next: (transfers) => {
        this.transfers = transfers;
        this.loading = false;

        this.dataStatus = {
          type: 'success',
          message: `✅ Mock data loaded successfully! Loaded ${transfers.length} transfers from local storage.`,
        };
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading mock data:', error);

        this.dataStatus = {
          type: 'error',
          message: '❌ Error loading mock data. Check console for details.',
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
}
