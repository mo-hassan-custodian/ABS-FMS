import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AuthorizedFileTransfer,
  AuthorizedFileTransferCreateRequest,
  AuthorizedFileTransferStats,
  AuthorizedFileTransferFilter,
} from '../models/authorized-file-transfer.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorizedFileTransferService {
  private readonly STORAGE_KEY = 'abs_fms_authorized_transfers';
  private transfersSubject = new BehaviorSubject<AuthorizedFileTransfer[]>([]);
  public transfers$ = this.transfersSubject.asObservable();

  constructor() {
    // Using localStorage for data persistence
    this.loadTransfersFromStorage();
  }

  // Method to clear localStorage and regenerate data (for debugging)
  clearAndRegenerate(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeSampleData();
  }

  private loadTransfersFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const transfers = JSON.parse(stored).map((t: any) => ({
          ...t,
          date: new Date(t.date),
          authorizationDate: new Date(t.authorizationDate),
          requestDate: new Date(t.requestDate),
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
      // Death Claims Data
      {
        id: 'AFT-001',
        remarks:
          'Life insurance death claim settlement for policy holder John Doe',
        voucherNoRef: 'VCH-DTH-2024-001',
        date: getRandomDate(2),
        narrative: 'Death claim settlement - Policy No: LIF-2020-456',
        bankAccount: 'Death Claims Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: 2500000,
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Michael Chen',
        requestDate: getRandomDate(5),
        type: 'DEATH_CLAIM',
        document: 'DEATH_CLAIM_FORM_001.pdf',
        payee: 'Abel Jack',
      },
      {
        id: 'AFT-002',
        remarks: 'Group life insurance death benefit payment',
        voucherNoRef: 'VCH-DTH-2024-002',
        date: getRandomDate(1),
        narrative: 'Group life death benefit - Employee ID: EMP-2023-789',
        bankAccount: 'Death Claims Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: 1800000,
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Lisa Anderson',
        requestDate: getRandomDate(4),
        type: 'DEATH_CLAIM',
        document: 'GROUP_DEATH_CLAIM_002.pdf',
        payee: 'Bimbo Chidera',
      },
      {
        id: 'AFT-003',
        remarks: 'Term life insurance death claim payout',
        voucherNoRef: 'VCH-DTH-2024-003',
        date: new Date(), // Today
        narrative: 'Term life death claim - Policy No: TERM-2019-123',
        bankAccount: 'Death Claims Account - 1234567890',
        currencyCode: 'NGN',
        amountPayee: 3200000,
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(1),
        preparedBy: 'James Rodriguez',
        requestDate: getRandomDate(3),
        type: 'DEATH_CLAIM',
        document: 'TERM_DEATH_CLAIM_003.pdf',
        payee: 'Chioma Ade',
      },

      // Policy Surrender Data
      {
        id: 'AFT-004',
        remarks: 'Whole life policy surrender value payment',
        voucherNoRef: 'VCH-SUR-2024-004',
        date: getRandomDate(3),
        narrative: 'Policy surrender - Policy No: WHL-2018-456',
        bankAccount: 'Policy Surrender Account - 2345678901',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(800000, 1500000),
        authorisedBy: 'Michael Thompson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Grace Adebayo',
        requestDate: getRandomDate(6),
        type: 'POLICY_SURRENDER',
        document: 'POLICY_SURRENDER_004.pdf',
        payee: 'Dolapo',
      },
      {
        id: 'AFT-005',
        remarks: 'Endowment policy early surrender',
        voucherNoRef: 'VCH-SUR-2024-005',
        date: getRandomDate(2),
        narrative: 'Early surrender - Endowment Policy No: END-2020-789',
        bankAccount: 'Policy Surrender Account - 2345678901',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(600000, 1200000),
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Olumide Fashola',
        requestDate: getRandomDate(5),
        type: 'POLICY_SURRENDER',
        document: 'ENDOWMENT_SURRENDER_005.pdf',
        payee: 'Dayo',
      },

      // Commission Data
      {
        id: 'AFT-006',
        remarks: 'Agent commission payment for Q1 2024 sales performance',
        voucherNoRef: 'VCH-COM-2024-006',
        date: getRandomDate(4),
        narrative: 'Quarterly commission payment - Agent: Adebayo Ogundimu',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(180000, 350000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(5),
        preparedBy: 'Emeka Okonkwo',
        requestDate: getRandomDate(7),
        type: 'COMMISSION',
        document: 'COMMISSION_STATEMENT_Q1_2024.pdf',
        payee: 'Segun',
      },
      {
        id: 'AFT-007',
        remarks: 'Broker commission for life insurance placement',
        voucherNoRef: 'VCH-COM-2024-007',
        date: getRandomDate(1),
        narrative:
          'Life insurance broker commission - Premium Insurance Brokers',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(450000, 850000),
        authorisedBy: 'Patricia Davis',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Funmi Adebisi',
        requestDate: getRandomDate(4),
        type: 'COMMISSION',
        document: 'LIFE_BROKER_COMMISSION_007.pdf',
        payee: 'Salewa',
      },
      {
        id: 'AFT-008',
        remarks: 'Reinsurance commission payment',
        voucherNoRef: 'VCH-COM-2024-008',
        date: new Date(), // Today
        narrative: 'Reinsurance commission - Continental Re',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'USD',
        amountPayee: getRandomAmount(25000, 75000),
        authorisedBy: 'Robert Taylor',
        authorizationDate: getRandomDate(1),
        preparedBy: 'Kemi Ogundimu',
        requestDate: getRandomDate(3),
        type: 'COMMISSION',
        document: 'REINSURANCE_COMMISSION_008.pdf',
        payee: 'James',
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
        type: 'COMMISSION',
        document: 'COMMISSION_STATEMENT_Q1_2024.pdf',
        payee: 'Jonah',
      },
      {
        id: 'AFT-012',
        remarks: 'Broker commission for life insurance placement',
        voucherNoRef: 'VCH-COM-2024-012',
        date: new Date(), // Today
        narrative:
          'Life insurance broker commission - Premium Insurance Brokers',
        bankAccount: 'Commission Payment Account - 9876543210',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(450000, 850000),
        authorisedBy: 'Patricia Davis',
        authorizationDate: getRandomDate(1),
        preparedBy: 'Kevin Brown',
        requestDate: getRandomDate(2),
        type: 'COMMISSION',
        document: 'LIFE_BROKER_COMMISSION_012.pdf',
        payee: 'Jamiu',
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
        type: 'COMMISSION',
        document: 'REINSURANCE_COMMISSION_013.pdf',
        payee: 'Rosemary',
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
        type: 'COMMISSION',
        document: 'MOTOR_AGENT_COMMISSION_014.pdf',
        payee: 'Sunday',
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
        type: 'COMMISSION',
        document: 'CORPORATE_BROKER_015.pdf',
        payee: 'Remi',
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
        type: 'COMMISSION',
        document: 'HEALTH_AGENT_016.pdf',
        payee: 'Tunde',
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
        type: 'COMMISSION',
        document: 'MARINE_BROKER_017.pdf',
        payee: 'Taju',
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
        type: 'COMMISSION',
        document: 'AVIATION_COMMISSION_018.pdf',
        payee: 'Bunmi',
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
        type: 'COMMISSION',
        document: 'PROFESSIONAL_BROKER_019.pdf',
        payee: 'Bimpe',
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
        type: 'COMMISSION',
        document: 'FIRE_AGENT_020.pdf',
        payee: 'Seun',
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
        type: 'FULL_MATURITIES',
        document: 'LIFE_MATURITY_021.pdf',
        payee: 'kemi',
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
        type: 'FULL_MATURITIES',
        document: 'ENDOWMENT_MATURITY_022.pdf',
        payee: 'Kunle',
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
        type: 'FULL_MATURITIES',
        document: 'TERM_MATURITY_023.pdf',
        payee: 'Kayode',
      },
      {
        id: 'AFT-0113',
        remarks: 'Term life insurance maturity payout',
        voucherNoRef: 'VCH-MAT-2024-0113',
        date: getRandomDate(3),
        narrative: 'Term life maturity - Policy No: TERM-2019-023',
        bankAccount: 'Surrenders Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(600000, 1100000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Grace Adebayo',
        requestDate: getRandomDate(6),
        type: 'POLICY_SURRENDER',
        document: 'SURRENDERS_023.pdf',
        payee: 'Bayo',
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
        type: 'FULL_MATURITIES',
        document: 'WHOLE_LIFE_024.pdf',
        payee: 'Johanna',
      },
      {
        id: 'AFT-0214',
        remarks: 'Policy cancellation refund for cancelled policy',
        voucherNoRef: 'VCH-CAN-2024-0214',
        date: getRandomDate(2),
        narrative: 'Policy cancellation refund - Policy No: WHL-2017-024',
        bankAccount: 'Cancellation Refund Account - 9999000011',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(50000, 150000),
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Kemi Ogundimu',
        requestDate: getRandomDate(5),
        type: 'POLICY_CANCELLATION',
        document: 'CANCELLATION_0214.pdf',
        payee: 'John',
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
        type: 'FULL_MATURITIES',
        document: 'UNIVERSAL_LIFE_025.pdf',
        payee: 'Bose',
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
        type: 'FULL_MATURITIES',
        document: 'VARIABLE_LIFE_026.pdf',
        payee: 'Dayo',
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
        type: 'FULL_MATURITIES',
        document: 'GROUP_LIFE_027.pdf',
        payee: 'Bayo',
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
        type: 'ANNUITY_MATURITIES',
        document: 'ANNUITY_028.pdf',
        payee: 'Ife',
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
        type: 'FULL_MATURITIES',
        document: 'EDUCATION_029.pdf',
        payee: 'Bright',
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
        type: 'FULL_MATURITIES',
        document: 'RETIREMENT_030.pdf',
        payee: 'Filomena',
      },

      // Partial Maturities Data
      {
        id: 'AFT-031',
        remarks: 'Partial maturity withdrawal from endowment policy',
        voucherNoRef: 'VCH-PAR-2024-031',
        date: getRandomDate(1),
        narrative: 'Partial maturity - Policy No: END-2020-031',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(300000, 600000),
        authorisedBy: 'Robert Taylor',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Jennifer Lee',
        requestDate: getRandomDate(4),
        type: 'PARTIAL_MATURITIES',
        document: 'PARTIAL_MATURITY_031.pdf',
        payee: 'Jonah',
      },
      {
        id: 'AFT-032',
        remarks: 'Partial maturity benefit from whole life policy',
        voucherNoRef: 'VCH-PAR-2024-032',
        date: new Date(), // Today
        narrative: 'Partial maturity withdrawal - Policy No: WHL-2019-032',
        bankAccount: 'Policy Benefits Account - 5555666677',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(450000, 850000),
        authorisedBy: 'Patricia Davis',
        authorizationDate: getRandomDate(1),
        preparedBy: 'Kevin Brown',
        requestDate: getRandomDate(2),
        type: 'PARTIAL_MATURITIES',
        document: 'PARTIAL_WHOLE_LIFE_032.pdf',
        payee: 'Jamiu',
      },

      // Investment Maturities Data
      {
        id: 'AFT-033',
        remarks: 'Investment-linked policy maturity payout',
        voucherNoRef: 'VCH-INV-2024-033',
        date: getRandomDate(3),
        narrative: 'Investment maturity - Policy No: INV-2019-033',
        bankAccount: 'Investment Account - 7777888899',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(900000, 1800000),
        authorisedBy: 'Michael Thompson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Grace Adebayo',
        requestDate: getRandomDate(6),
        type: 'INVESTMENT_MATURITIES',
        document: 'INVESTMENT_MATURITY_033.pdf',
        payee: 'Dolapo',
      },
      {
        id: 'AFT-034',
        remarks: 'Unit-linked investment policy maturity',
        voucherNoRef: 'VCH-INV-2024-034',
        date: getRandomDate(2),
        narrative: 'Unit-linked maturity - Policy No: UNI-2020-034',
        bankAccount: 'Investment Account - 7777888899',
        currencyCode: 'USD',
        amountPayee: getRandomAmount(15000, 45000),
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Olumide Fashola',
        requestDate: getRandomDate(5),
        type: 'INVESTMENT_MATURITIES',
        document: 'UNIT_LINKED_034.pdf',
        payee: 'Dayo',
      },

      // Policy Loan Data
      {
        id: 'AFT-035',
        remarks: 'Policy loan disbursement against whole life policy',
        voucherNoRef: 'VCH-LON-2024-035',
        date: getRandomDate(4),
        narrative: 'Policy loan - Policy No: WHL-2018-035',
        bankAccount: 'Policy Loan Account - 3333444455',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(200000, 500000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(5),
        preparedBy: 'Emeka Okonkwo',
        requestDate: getRandomDate(7),
        type: 'POLICY_LOAN',
        document: 'POLICY_LOAN_035.pdf',
        payee: 'Segun',
      },
      {
        id: 'AFT-036',
        remarks: 'Emergency policy loan against endowment policy',
        voucherNoRef: 'VCH-LON-2024-036',
        date: getRandomDate(1),
        narrative: 'Emergency loan - Policy No: END-2019-036',
        bankAccount: 'Policy Loan Account - 3333444455',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(150000, 400000),
        authorisedBy: 'Patricia Davis',
        authorizationDate: getRandomDate(2),
        preparedBy: 'Funmi Adebisi',
        requestDate: getRandomDate(4),
        type: 'POLICY_LOAN',
        document: 'EMERGENCY_LOAN_036.pdf',
        payee: 'Salewa',
      },

      // Policy Termination Data
      {
        id: 'AFT-037',
        remarks: 'Policy termination refund for cancelled term life',
        voucherNoRef: 'VCH-TER-2024-037',
        date: new Date(), // Today
        narrative: 'Policy termination - Policy No: TERM-2023-037',
        bankAccount: 'Policy Termination Account - 4444555566',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(100000, 300000),
        authorisedBy: 'Robert Taylor',
        authorizationDate: getRandomDate(1),
        preparedBy: 'Kemi Ogundimu',
        requestDate: getRandomDate(3),
        type: 'POLICY_TERMINATION',
        document: 'TERMINATION_037.pdf',
        payee: 'James',
      },

      // Partial Withdrawal Data
      {
        id: 'AFT-038',
        remarks: 'Partial withdrawal from universal life policy',
        voucherNoRef: 'VCH-WIT-2024-038',
        date: getRandomDate(5),
        narrative: 'Partial withdrawal - Policy No: UNI-2020-038',
        bankAccount: 'Withdrawal Account - 6666777788',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(250000, 600000),
        authorisedBy: 'Michael Thompson',
        authorizationDate: getRandomDate(6),
        preparedBy: 'Tunde Bakare',
        requestDate: getRandomDate(8),
        type: 'PARTIAL_WITHDRAWAL',
        document: 'PARTIAL_WITHDRAWAL_038.pdf',
        payee: 'Johnson',
      },

      // Annuity Maturities Data
      {
        id: 'AFT-039',
        remarks: 'Annuity policy maturity payout',
        voucherNoRef: 'VCH-ANN-2024-039',
        date: getRandomDate(3),
        narrative: 'Annuity maturity - Policy No: ANN-2017-039',
        bankAccount: 'Annuity Account - 8888999900',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(1100000, 2100000),
        authorisedBy: 'Sarah Johnson',
        authorizationDate: getRandomDate(4),
        preparedBy: 'Adebola Ogundipe',
        requestDate: getRandomDate(6),
        type: 'ANNUITY_MATURITIES',
        document: 'ANNUITY_039.pdf',
        payee: 'Michael',
      },

      // Policy Cancellation Data
      {
        id: 'AFT-040',
        remarks: 'Policy cancellation refund for motor insurance',
        voucherNoRef: 'VCH-CAN-2024-040',
        date: getRandomDate(2),
        narrative: 'Policy cancellation - Policy No: MOT-2024-040',
        bankAccount: 'Cancellation Refund Account - 9999000011',
        currencyCode: 'NGN',
        amountPayee: getRandomAmount(50000, 150000),
        authorisedBy: 'David Wilson',
        authorizationDate: getRandomDate(3),
        preparedBy: 'Grace Adebayo',
        requestDate: getRandomDate(5),
        type: 'POLICY_CANCELLATION',
        document: 'CANCELLATION_040.pdf',
        payee: 'Filomena',
      },
    ];

    this.transfersSubject.next(sampleTransfers);
    this.saveTransfersToStorage(sampleTransfers);
  }

  getAllTransfers(): Observable<AuthorizedFileTransfer[]> {
    // Return local data from BehaviorSubject
    return this.transfers$;
  }

  getTransferById(id: string): Observable<AuthorizedFileTransfer | undefined> {
    return this.transfers$.pipe(
      map((transfers) => transfers.find((t) => t.id === id))
    );
  }

  searchTransfers(
    filter: AuthorizedFileTransferFilter
  ): Observable<AuthorizedFileTransfer[]> {
    return this.transfers$.pipe(
      map((transfers) => {
        let filtered = [...transfers];

        // Apply search term filter
        if (filter.searchTerm && filter.searchTerm.trim()) {
          const searchTerm = filter.searchTerm.toLowerCase();
          filtered = filtered.filter(
            (transfer) =>
              transfer.remarks.toLowerCase().includes(searchTerm) ||
              transfer.voucherNoRef.toLowerCase().includes(searchTerm) ||
              transfer.narrative.toLowerCase().includes(searchTerm) ||
              transfer.bankAccount.toLowerCase().includes(searchTerm) ||
              transfer.authorisedBy.toLowerCase().includes(searchTerm) ||
              transfer.preparedBy.toLowerCase().includes(searchTerm) ||
              transfer.document.toLowerCase().includes(searchTerm) ||
              transfer.payee.toLowerCase().includes(searchTerm)
          );
        }

        // Apply type filter
        if (filter.type && filter.type !== 'ALL') {
          filtered = filtered.filter(
            (transfer) => transfer.type === filter.type
          );
        }

        // Apply date range filter
        if (filter.dateFrom) {
          filtered = filtered.filter(
            (transfer) => transfer.date >= filter.dateFrom!
          );
        }
        if (filter.dateTo) {
          filtered = filtered.filter(
            (transfer) => transfer.date <= filter.dateTo!
          );
        }

        return filtered;
      })
    );
  }

  getTransferStats(): Observable<AuthorizedFileTransferStats> {
    return this.transfers$.pipe(
      map((transfers) => ({
        total: transfers.length,
        byType: {
          policySurrender: transfers.filter(
            (t) => t.type === 'POLICY_SURRENDER'
          ).length,
          partialMaturities: transfers.filter(
            (t) => t.type === 'PARTIAL_MATURITIES'
          ).length,
          fullMaturities: transfers.filter((t) => t.type === 'FULL_MATURITIES')
            .length,
          investmentMaturities: transfers.filter(
            (t) => t.type === 'INVESTMENT_MATURITIES'
          ).length,
          policyLoan: transfers.filter((t) => t.type === 'POLICY_LOAN').length,
          policyTermination: transfers.filter(
            (t) => t.type === 'POLICY_TERMINATION'
          ).length,
          partialWithdrawal: transfers.filter(
            (t) => t.type === 'PARTIAL_WITHDRAWAL'
          ).length,
          annuityMaturities: transfers.filter(
            (t) => t.type === 'ANNUITY_MATURITIES'
          ).length,
          deathClaim: transfers.filter((t) => t.type === 'DEATH_CLAIM').length,
          commission: transfers.filter((t) => t.type === 'COMMISSION').length,
          policyCancellation: transfers.filter(
            (t) => t.type === 'POLICY_CANCELLATION'
          ).length,
        },
      }))
    );
  }

  // Authorize a payment and remove it from the list
  authorizePayment(
    transferId: string,
    authorizationData: any
  ): Observable<{ success: boolean; message: string }> {
    return new Observable((observer) => {
      // Simulate API call delay
      setTimeout(() => {
        try {
          const currentTransfers = this.transfersSubject.value;
          const transferIndex = currentTransfers.findIndex(
            (t) => t.id === transferId
          );

          if (transferIndex === -1) {
            observer.next({ success: false, message: 'Transfer not found' });
            observer.complete();
            return;
          }

          const transfer = currentTransfers[transferIndex];

          // Create authorization record for backend (simulate sending to API)
          const authorizationRecord = {
            transferId: transfer.id,
            voucherNoRef: transfer.voucherNoRef,
            payee: transfer.payee,
            amount: transfer.amountPayee,
            currencyCode: transfer.currencyCode,
            fromAccount: {
              bankName: authorizationData.selectedAccount.bankName,
              accountNumber: authorizationData.selectedAccount.accountNumber,
              accountType: authorizationData.selectedAccount.accountType,
            },
            payeeBankAccount: transfer.bankAccount,
            transferType: transfer.type,
            narrative: transfer.narrative,
            authorizedBy: 'Current User', // In real app, get from auth service
            authorizedAt: new Date().toISOString(),
            status: 'AUTHORIZED',
          };

          // Log the authorization record (simulate sending to backend)
          console.log('Sending authorization to backend:', authorizationRecord);

          // Store authorization record in localStorage (simulate backend storage)
          this.storeAuthorizationRecord(authorizationRecord);

          // Remove the transfer from the pending list
          const updatedTransfers = currentTransfers.filter(
            (t) => t.id !== transferId
          );
          this.transfersSubject.next(updatedTransfers);
          this.saveTransfersToStorage(updatedTransfers);

          observer.next({
            success: true,
            message: `Payment ${transfer.voucherNoRef} authorized successfully and removed from pending list`,
          });
          observer.complete();
        } catch (error) {
          observer.next({
            success: false,
            message: 'Failed to authorize payment. Please try again.',
          });
          observer.complete();
        }
      }, 1000); // Simulate 1 second API call
    });
  }

  // Store authorization record (simulate backend API call)
  private storeAuthorizationRecord(authorizationRecord: any): void {
    try {
      const existingRecords = JSON.parse(
        localStorage.getItem('abs_fms_authorized_payments') || '[]'
      );
      existingRecords.push(authorizationRecord);
      localStorage.setItem(
        'abs_fms_authorized_payments',
        JSON.stringify(existingRecords)
      );
      console.log('Authorization record stored successfully');
    } catch (error) {
      console.error('Error storing authorization record:', error);
    }
  }

  // Get all authorized payments (for future reference)
  getAuthorizedPayments(): Observable<any[]> {
    return new Observable((observer) => {
      try {
        const records = JSON.parse(
          localStorage.getItem('abs_fms_authorized_payments') || '[]'
        );
        observer.next(records);
        observer.complete();
      } catch (error) {
        console.error('Error retrieving authorized payments:', error);
        observer.next([]);
        observer.complete();
      }
    });
  }

  // Create new authorized file transfer
  createTransfer(
    request: AuthorizedFileTransferCreateRequest
  ): Observable<AuthorizedFileTransfer> {
    const newTransfer: AuthorizedFileTransfer = {
      id: this.generateId(),
      ...request,
      date: new Date(),
      authorizationDate: new Date(),
      requestDate: new Date(),
    };

    const currentTransfers = this.transfersSubject.value;
    const updatedTransfers = [newTransfer, ...currentTransfers];
    this.transfersSubject.next(updatedTransfers);
    this.saveTransfersToStorage(updatedTransfers);

    return of(newTransfer);
  }

  // Update existing transfer
  updateTransfer(
    id: string,
    updates: Partial<AuthorizedFileTransfer>
  ): Observable<AuthorizedFileTransfer> {
    const currentTransfers = this.transfersSubject.value;
    const index = currentTransfers.findIndex((t) => t.id === id);
    if (index !== -1) {
      const updatedTransfer = { ...currentTransfers[index], ...updates };
      currentTransfers[index] = updatedTransfer;
      this.transfersSubject.next([...currentTransfers]);
      this.saveTransfersToStorage(currentTransfers);
      return of(updatedTransfer);
    }
    throw new Error(`Transfer with id ${id} not found`);
  }

  // Delete transfer
  deleteTransfer(id: string): Observable<boolean> {
    const currentTransfers = this.transfersSubject.value;
    const filteredTransfers = currentTransfers.filter((t) => t.id !== id);
    this.transfersSubject.next(filteredTransfers);
    this.saveTransfersToStorage(filteredTransfers);
    return of(true);
  }

  private generateId(): string {
    return 'AFT-' + Math.random().toString(36).substring(2, 11).toUpperCase();
  }
}
