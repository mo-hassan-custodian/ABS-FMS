import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
  AuthorizedFileTransfer, 
  AuthorizedFileTransferCreateRequest, 
  AuthorizedFileTransferStats,
  AuthorizedFileTransferFilter 
} from '../models/authorized-file-transfer.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedFileTransferService {
  private readonly STORAGE_KEY = 'abs_fms_authorized_transfers';
  private transfersSubject = new BehaviorSubject<AuthorizedFileTransfer[]>([]);
  public transfers$ = this.transfersSubject.asObservable();

  constructor() {
    this.loadTransfersFromStorage();
  }

  private loadTransfersFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const transfers = JSON.parse(stored).map((t: any) => ({
          ...t,
          date: new Date(t.date),
          authorizationDate: new Date(t.authorizationDate),
          requestDate: new Date(t.requestDate)
        }));
        this.transfersSubject.next(transfers);
      } else {
        // Initialize with sample data
        this.initializeSampleData();
      }
    } catch (error) {
      console.error('Error loading transfers from storage:', error);
      this.initializeSampleData();
    }
  }

  private saveTransfersToStorage(transfers: AuthorizedFileTransfer[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transfers));
    } catch (error) {
      console.error('Error saving transfers to storage:', error);
    }
  }

  private initializeSampleData(): void {
    const today = new Date();
    const getRandomDate = (daysBack: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
      return date;
    };

    const getRandomAmount = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const sampleTransfers: AuthorizedFileTransfer[] = [
      // Recent Claims Data (Days 0-7)
      {
        id: 'AFT-001',
        remarks: 'Motor insurance claim settlement for policy holder John Doe',
        voucherNoRef: 'VCH-CLM-2024-001',
        date: getRandomDate(2),
        narrative: 'Settlement of motor vehicle accident claim - Policy No: POL-MOT-2023-456',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: 850000,
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Michael Chen',
        requestDate: getRandomDate(5),
        type: 'CLAIMS',
        document: 'CLAIM_SETTLEMENT_FORM_001.pdf'
      },
      {
        id: 'AFT-002',
        remarks: 'Fire insurance claim for commercial property damage',
        voucherNoRef: 'VCH-CLM-2024-002',
        date: getRandomDate(1),
        narrative: 'Fire damage claim settlement - ABC Manufacturing Ltd',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: 2500000,
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Lisa Anderson',
        requestDate: getRandomDate(4),
        type: 'CLAIMS',
        document: 'FIRE_CLAIM_REPORT_002.pdf'
      },
      {
        id: 'AFT-003',
        remarks: 'Health insurance claim for medical treatment',
        voucherNoRef: 'VCH-CLM-2024-003',
        date: new Date(), // Today
        narrative: 'Medical claim settlement - Lagos University Teaching Hospital',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: 450000,
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(1),
        preparedBy: 'James Rodriguez',
        requestDate: getRandomDate(3),
        type: 'CLAIMS',
        document: 'MEDICAL_CLAIM_003.pdf'
      },
      {
        id: 'AFT-004',
        remarks: 'Property insurance claim for flood damage',
        voucherNoRef: 'VCH-CLM-2024-004',
        date: getRandomDate(3),
        narrative: 'Flood damage claim - Residential Property Lagos',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(300000, 800000),
        authorisedBy: 'Michael Thompson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Grace Adebayo',
        requestDate: getRandomDate(6),
        type: 'CLAIMS',
        document: 'FLOOD_CLAIM_004.pdf'
      },
      {
        id: 'AFT-005',
        remarks: 'Marine cargo insurance claim settlement',
        voucherNoRef: 'VCH-CLM-2024-005',
        date: getRandomDate(2),
        narrative: 'Cargo damage claim - Import shipment from China',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'USD',
        amountPayee: getRandomAmount(15000, 45000),
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Olumide Fashola',
        requestDate: getRandomDate(5),
        type: 'CLAIMS',
        document: 'MARINE_CLAIM_005.pdf'
      },
      {
        id: 'AFT-006',
        remarks: 'Aviation insurance claim for aircraft damage',
        voucherNoRef: 'VCH-CLM-2024-006',
        date: getRandomDate(4),
        narrative: 'Aircraft maintenance claim - Nigerian Airways',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(5000000, 8000000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(5),
        preparedBy: 'Emeka Okonkwo',
        requestDate: getRandomDate(7),
        type: 'CLAIMS',
        document: 'AVIATION_CLAIM_006.pdf'
      },
      {
        id: 'AFT-007',
        remarks: 'Professional indemnity claim settlement',
        voucherNoRef: 'VCH-CLM-2024-007',
        date: getRandomDate(1),
        narrative: 'Professional liability claim - Legal Services Ltd',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(200000, 600000),
        authorisedBy: 'Patricia Davis',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Funmi Adebisi',
        requestDate: getRandomDate(4),
        type: 'CLAIMS',
        document: 'PROFESSIONAL_CLAIM_007.pdf'
      },
      {
        id: 'AFT-008',
        remarks: 'Workmen compensation claim payment',
        voucherNoRef: 'VCH-CLM-2024-008',
        date: new Date(), // Today
        narrative: 'Work injury compensation - Construction Worker',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(150000, 400000),
        authorisedBy: 'Robert Taylor',
        authorizationDate: getRandomDate(1),
        preparedBy: 'Kemi Ogundimu',
        requestDate: getRandomDate(3),
        type: 'CLAIMS',
        document: 'WORKMEN_CLAIM_008.pdf'
      },
      {
        id: 'AFT-009',
        remarks: 'Cyber liability insurance claim',
        voucherNoRef: 'VCH-CLM-2024-009',
        date: getRandomDate(5),
        narrative: 'Data breach incident claim - Tech Solutions Nigeria',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(1000000, 3000000),
        authorisedBy: 'Michael Thompson',
        authorizationDate: getRandomDate(6),
        preparedBy: 'Tunde Bakare',
        requestDate: getRandomDate(8),
        type: 'CLAIMS',
        document: 'CYBER_CLAIM_009.pdf'
      },
      {
        id: 'AFT-010',
        remarks: 'Directors and officers liability claim',
        voucherNoRef: 'VCH-CLM-2024-010',
        date: getRandomDate(3),
        narrative: 'D&O liability claim - Corporate Board Decision',
        bankAccount: 'Claims Settlement Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(2000000, 5000000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Adebola Ogundipe',
        requestDate: getRandomDate(6),
        type: 'CLAIMS',
        document: 'DO_CLAIM_010.pdf'
      },

      // Commission Data (Recent)
      {
        id: 'AFT-011',
        remarks: 'Agent commission payment for Q1 2024 sales performance',
        voucherNoRef: 'VCH-COM-2024-011',
        date: getRandomDate(1),
        narrative: 'Quarterly commission payment - Agent: Adebayo Ogundimu',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(180000, 350000),
        authorisedBy: 'Robert Taylor',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Jennifer Lee',
        requestDate: getRandomDate(4),
        type: 'COMMISSIONS',
        document: 'COMMISSION_STATEMENT_Q1_2024.pdf'
      },
      {
        id: 'AFT-012',
        remarks: 'Broker commission for life insurance placement',
        voucherNoRef: 'VCH-COM-2024-012',
        date: new Date(), // Today
        narrative: 'Life insurance broker commission - Premium Insurance Brokers',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(450000, 850000),
        authorisedBy: 'Patricia Davis',
        authorizationDate: getRandomDate(1),
        preparedBy: 'Kevin Brown',
        requestDate: getRandomDate(2),
        type: 'COMMISSIONS',
        document: 'LIFE_BROKER_COMMISSION_012.pdf'
      },
      {
        id: 'AFT-013',
        remarks: 'Reinsurance commission payment',
        voucherNoRef: 'VCH-COM-2024-013',
        date: getRandomDate(3),
        narrative: 'Reinsurance commission - Continental Re',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'USD',
        amountPayee: getRandomAmount(25000, 75000),
        authorisedBy: 'Michael Thompson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Funmi Adebisi',
        requestDate: getRandomDate(6),
        type: 'COMMISSIONS',
        document: 'REINSURANCE_COMMISSION_013.pdf'
      },
      {
        id: 'AFT-014',
        remarks: 'Motor insurance agent commission',
        voucherNoRef: 'VCH-COM-2024-014',
        date: getRandomDate(2),
        narrative: 'Motor insurance commission - Agent: Chidi Okwu',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(95000, 220000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Tunde Bakare',
        requestDate: getRandomDate(5),
        type: 'COMMISSIONS',
        document: 'MOTOR_AGENT_COMMISSION_014.pdf'
      },
      {
        id: 'AFT-015',
        remarks: 'Corporate insurance broker commission',
        voucherNoRef: 'VCH-COM-2024-015',
        date: getRandomDate(4),
        narrative: 'Corporate insurance placement - Elite Brokers Ltd',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(1200000, 2500000),
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(5),
        preparedBy: 'Grace Adebayo',
        requestDate: getRandomDate(7),
        type: 'COMMISSIONS',
        document: 'CORPORATE_BROKER_015.pdf'
      },
      {
        id: 'AFT-016',
        remarks: 'Health insurance agent commission',
        voucherNoRef: 'VCH-COM-2024-016',
        date: getRandomDate(1),
        narrative: 'Health insurance commission - Agent: Fatima Aliyu',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(75000, 180000),
        authorisedBy: 'Robert Taylor',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Kemi Ogundimu',
        requestDate: getRandomDate(4),
        type: 'COMMISSIONS',
        document: 'HEALTH_AGENT_016.pdf'
      },
      {
        id: 'AFT-017',
        remarks: 'Marine insurance broker commission',
        voucherNoRef: 'VCH-COM-2024-017',
        date: getRandomDate(5),
        narrative: 'Marine cargo insurance - Seaport Brokers',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'USD',
        amountPayee: getRandomAmount(18000, 45000),
        authorisedBy: 'Patricia Davis',
        authorizationDate: getRandomDate(6),
        preparedBy: 'Olumide Fashola',
        requestDate: getRandomDate(8),
        type: 'COMMISSIONS',
        document: 'MARINE_BROKER_017.pdf'
      },
      {
        id: 'AFT-018',
        remarks: 'Aviation insurance commission payment',
        voucherNoRef: 'VCH-COM-2024-018',
        date: new Date(), // Today
        narrative: 'Aviation insurance commission - Sky Insurance Brokers',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(850000, 1500000),
        authorisedBy: 'Michael Thompson',
        authorizationDate: getRandomDate(1),
        preparedBy: 'Emeka Okonkwo',
        requestDate: getRandomDate(3),
        type: 'COMMISSIONS',
        document: 'AVIATION_COMMISSION_018.pdf'
      },
      {
        id: 'AFT-019',
        remarks: 'Professional indemnity broker commission',
        voucherNoRef: 'VCH-COM-2024-019',
        date: getRandomDate(3),
        narrative: 'Professional indemnity placement - Legal Shield Brokers',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(320000, 680000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Adebola Ogundipe',
        requestDate: getRandomDate(6),
        type: 'COMMISSIONS',
        document: 'PROFESSIONAL_BROKER_019.pdf'
      },
      {
        id: 'AFT-020',
        remarks: 'Fire insurance agent commission',
        voucherNoRef: 'VCH-COM-2024-020',
        date: getRandomDate(2),
        narrative: 'Fire insurance commission - Agent: Ibrahim Musa',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(125000, 285000),
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Funmi Adebisi',
        requestDate: getRandomDate(5),
        type: 'COMMISSIONS',
        document: 'FIRE_AGENT_020.pdf'
      },

      // Policy Maturity Data (Recent)
      {
        id: 'AFT-021',
        remarks: 'Life insurance policy maturity benefit payment',
        voucherNoRef: 'VCH-MAT-2024-021',
        date: getRandomDate(1),
        narrative: 'Policy maturity payment - Policy No: LIF-2019-021',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(800000, 1500000),
        authorisedBy: 'Patricia Davis',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Thomas Wilson',
        requestDate: getRandomDate(4),
        type: 'POLICY_MATURITY',
        document: 'LIFE_MATURITY_021.pdf'
      },
      {
        id: 'AFT-022',
        remarks: 'Endowment policy maturity with bonus',
        voucherNoRef: 'VCH-MAT-2024-022',
        date: new Date(), // Today
        narrative: 'Endowment policy maturity - Policy No: END-2018-022',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(1200000, 2200000),
        authorisedBy: 'Michael Thompson',
        authorizationDate: getRandomDate(1),
        preparedBy: 'Amanda Garcia',
        requestDate: getRandomDate(3),
        type: 'POLICY_MATURITY',
        document: 'ENDOWMENT_MATURITY_022.pdf'
      },
      {
        id: 'AFT-023',
        remarks: 'Term life insurance maturity payout',
        voucherNoRef: 'VCH-MAT-2024-023',
        date: getRandomDate(3),
        narrative: 'Term life maturity - Policy No: TERM-2019-023',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(600000, 1100000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Grace Adebayo',
        requestDate: getRandomDate(6),
        type: 'POLICY_MATURITY',
        document: 'TERM_MATURITY_023.pdf'
      },
      {
        id: 'AFT-024',
        remarks: 'Whole life insurance policy maturity',
        voucherNoRef: 'VCH-MAT-2024-024',
        date: getRandomDate(2),
        narrative: 'Whole life maturity - Policy No: WHL-2017-024',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(1500000, 2800000),
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Kemi Ogundimu',
        requestDate: getRandomDate(5),
        type: 'POLICY_MATURITY',
        document: 'WHOLE_LIFE_024.pdf'
      },
      {
        id: 'AFT-025',
        remarks: 'Universal life insurance maturity benefit',
        voucherNoRef: 'VCH-MAT-2024-025',
        date: getRandomDate(4),
        narrative: 'Universal life maturity - Policy No: UNI-2018-025',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(900000, 1800000),
        authorisedBy: 'Robert Taylor',
        authorizationDate: getRandomDate(5),
        preparedBy: 'Tunde Bakare',
        requestDate: getRandomDate(7),
        type: 'POLICY_MATURITY',
        document: 'UNIVERSAL_LIFE_025.pdf'
      },
      {
        id: 'AFT-026',
        remarks: 'Variable life insurance policy maturity',
        voucherNoRef: 'VCH-MAT-2024-026',
        date: getRandomDate(1),
        narrative: 'Variable life maturity - Policy No: VAR-2019-026',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(750000, 1400000),
        authorisedBy: 'Patricia Davis',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Olumide Fashola',
        requestDate: getRandomDate(4),
        type: 'POLICY_MATURITY',
        document: 'VARIABLE_LIFE_026.pdf'
      },
      {
        id: 'AFT-027',
        remarks: 'Group life insurance policy maturity',
        voucherNoRef: 'VCH-MAT-2024-027',
        date: getRandomDate(5),
        narrative: 'Group life maturity - Policy No: GRP-2018-027',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(2000000, 3500000),
        authorisedBy: 'Michael Thompson',
        authorizationDate: getRandomDate(6),
        preparedBy: 'Emeka Okonkwo',
        requestDate: getRandomDate(8),
        type: 'POLICY_MATURITY',
        document: 'GROUP_LIFE_027.pdf'
      },
      {
        id: 'AFT-028',
        remarks: 'Annuity policy maturity payout',
        voucherNoRef: 'VCH-MAT-2024-028',
        date: new Date(), // Today
        narrative: 'Annuity maturity - Policy No: ANN-2017-028',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(1100000, 2100000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(1),
        preparedBy: 'Funmi Adebisi',
        requestDate: getRandomDate(3),
        type: 'POLICY_MATURITY',
        document: 'ANNUITY_028.pdf'
      },
      {
        id: 'AFT-029',
        remarks: 'Education endowment policy maturity',
        voucherNoRef: 'VCH-MAT-2024-029',
        date: getRandomDate(3),
        narrative: 'Education endowment maturity - Policy No: EDU-2019-029',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(650000, 1250000),
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Adebola Ogundipe',
        requestDate: getRandomDate(6),
        type: 'POLICY_MATURITY',
        document: 'EDUCATION_029.pdf'
      },
      {
        id: 'AFT-030',
        remarks: 'Retirement savings policy maturity',
        voucherNoRef: 'VCH-MAT-2024-030',
        date: getRandomDate(2),
        narrative: 'Retirement savings maturity - Policy No: RET-2018-030',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(1800000, 3200000),
        authorisedBy: 'Robert Taylor',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Grace Adebayo',
        requestDate: getRandomDate(5),
        type: 'POLICY_MATURITY',
        document: 'RETIREMENT_030.pdf'
      }
    ];

    this.transfersSubject.next(sampleTransfers);
    this.saveTransfersToStorage(sampleTransfers);
  }

  getAllTransfers(): Observable<AuthorizedFileTransfer[]> {
    return this.transfers$;
  }

  getTransferById(id: string): Observable<AuthorizedFileTransfer | undefined> {
    return this.transfers$.pipe(
      map(transfers => transfers.find(t => t.id === id))
    );
  }

  searchTransfers(filter: AuthorizedFileTransferFilter): Observable<AuthorizedFileTransfer[]> {
    return this.transfers$.pipe(
      map(transfers => {
        let filtered = [...transfers];

        // Apply search term filter
        if (filter.searchTerm && filter.searchTerm.trim()) {
          const searchTerm = filter.searchTerm.toLowerCase();
          filtered = filtered.filter(transfer =>
            transfer.remarks.toLowerCase().includes(searchTerm) ||
            transfer.voucherNoRef.toLowerCase().includes(searchTerm) ||
            transfer.narrative.toLowerCase().includes(searchTerm) ||
            transfer.bankAccount.toLowerCase().includes(searchTerm) ||
            transfer.authorisedBy.toLowerCase().includes(searchTerm) ||
            transfer.preparedBy.toLowerCase().includes(searchTerm) ||
            transfer.document.toLowerCase().includes(searchTerm)
          );
        }

        // Apply type filter
        if (filter.type && filter.type !== 'ALL') {
          filtered = filtered.filter(transfer => transfer.type === filter.type);
        }

        // Apply date range filter
        if (filter.dateFrom) {
          filtered = filtered.filter(transfer => transfer.date >= filter.dateFrom!);
        }
        if (filter.dateTo) {
          filtered = filtered.filter(transfer => transfer.date <= filter.dateTo!);
        }

        return filtered;
      })
    );
  }

  getTransferStats(): Observable<AuthorizedFileTransferStats> {
    return this.transfers$.pipe(
      map(transfers => ({
        total: transfers.length,
        byType: {
          claims: transfers.filter(t => t.type === 'CLAIMS').length,
          commissions: transfers.filter(t => t.type === 'COMMISSIONS').length,
          policyMaturity: transfers.filter(t => t.type === 'POLICY_MATURITY').length
        }
      }))
    );
  }

  private generateId(): string {
    return 'AFT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}
