import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MenuIcon, { SubmenuClass } from '../../../../app/models/menu-icon';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  subitemClasses_general:SubmenuClass[] = [];
  showSideBar = true;
  menuitems:MenuIcon[] = [];
  activeSubmenu ?: MenuIcon;
  subitemClasses_transaction?: SubmenuClass[];
  subitemClasses_policy?: SubmenuClass[];
  subitemClasses_report?: SubmenuClass[];
  subitemClasses_setup?: SubmenuClass[];


  constructor(private _httpClient:HttpClient) {
   this.menuitems = [
    {
      "menuname": "Core Setup",
      "iconname": "settings",
      "submenuclass": [
        {
          "name": "Customer Management",
          "submenu": [
            {
              "icon": "people",
              "name": "Manage Customers",
              "route": "/App/AllClients",
              "routeParameters": {}
            },
            {
              "icon": "person_add",
              "name": "New Customer",
              "route": "/App/CreateCustomer",
              "routeParameters": {}
            }
          ]
        },
        {
          "name": "System Configuration",
          "submenu": [
            {
              "icon": "tune",
              "name": "Rate Setup",
              "route": "/App/rate-setup",
              "routeParameters": {}
            },
            {
              "icon": "business",
              "name": "Branch Setup",
              "route": "/App/branch-setup",
              "routeParameters": {}
            },
            {
              "icon": "category",
              "name": "Product Setup",
              "route": "/App/product-setup",
              "routeParameters": {}
            }
          ]
        }
      ]
    },
    {
      "menuname": "General Ledger",
      "iconname": "account_balance",
      "submenuclass": [
        {
          "name": "Chart of Accounts",
          "submenu": [
            {
              "icon": "list",
              "name": "View Chart of Accounts",
              "route": "/App/chart-of-accounts",
              "routeParameters": {}
            },
            {
              "icon": "add",
              "name": "Create Account",
              "route": "/App/create-account",
              "routeParameters": {}
            },
            {
              "icon": "edit",
              "name": "Modify Account",
              "route": "/App/modify-account",
              "routeParameters": {}
            }
          ]
        },
        {
          "name": "Journal Entries",
          "submenu": [
            {
              "icon": "create",
              "name": "Create Journal Entry",
              "route": "/App/create-journal",
              "routeParameters": {}
            },
            {
              "icon": "search",
              "name": "View Journal Entries",
              "route": "/App/view-journals",
              "routeParameters": {}
            },
            {
              "icon": "check_circle",
              "name": "Approve Journals",
              "route": "/App/approve-journals",
              "routeParameters": {}
            }
          ]
        },
        {
          "name": "Trial Balance",
          "submenu": [
            {
              "icon": "balance",
              "name": "Generate Trial Balance",
              "route": "/App/trial-balance",
              "routeParameters": {}
            },
            {
              "icon": "compare",
              "name": "Comparative Trial Balance",
              "route": "/App/comparative-trial-balance",
              "routeParameters": {}
            }
          ]
        },
        {
          "name": "Financial Statements",
          "submenu": [
            {
              "icon": "assessment",
              "name": "Profit & Loss",
              "route": "/App/profit-loss",
              "routeParameters": {}
            },
            {
              "icon": "account_balance_wallet",
              "name": "Balance Sheet",
              "route": "/App/balance-sheet",
              "routeParameters": {}
            },
            {
              "icon": "trending_up",
              "name": "Cash Flow Statement",
              "route": "/App/cash-flow",
              "routeParameters": {}
            }
          ]
        }
      ]
    },
    {
      "menuname": "Cash Book",
      "iconname": "money",
      "submenuclass": [
        {
          "name": "CB - Parameters",
          "submenu": [
            {
              "icon": "visibility",
              "name": "Data Capture",
              "route": "/App/NewProposal",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Convert to Proposal",
              "route": "/App/ConvertProposal",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Convert to Policy",
              "route": "",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Authorize Policy",
              "route": "/App/authorize-proposals",
              "routeParameters": {}
            },
          ]
        },
        {
          "name": "CB - Transactions",
          "submenu": [
            {
              "icon": "visibility",
              "name": "Data Capture",
              "route": "/App/create-requisition",
              "routeParameters": {}
            },
          ]
        },
        {
          "name": "CB - Requisitions",
          "submenu": [
            {
              "icon": "visibility",
              "name": "Create Requisition",
              "route": "/App/create-requisition",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Payee List",
              "route": "/App/create-payee",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Manage Requisition",
              "route": "/App/manage-requisitions",
              "routeParameters": {}
            },
          ]
        },
        {
          "name": "CB - Payments",
          "submenu": [
            {
              "icon": "visibility",
              "name": "Setup Payment Templates",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Authorize Payments",
              "route": "/App/authorized-file-transfer",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Setup Cheque Numbers",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Consolidate Requisitions",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Split Cheques",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Authorize",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Print",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Update Printed Payments",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Update PD Cheques",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Cheque Signing Setup",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Cheque Signing Mandate",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Currency Exceptions Setup",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "H2H Statuses",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Dispatch Cheques",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Cancel Payments",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Authorize Canceled Cheques",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Stale Payments",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Dispatch Cheque Preview",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Cheques Status",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "File Transfer Download",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "File Transfer Statuses",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Update File Transfer Status",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Authorise Canceled EFTs",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "VAT/WHTAX Certificate",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
            {
              "icon": "visibility",
              "name": "Reports",
              "route": "/App/setup-payments",
              "routeParameters": {}
            },
          ]
        },
        {
          "name": "CB - Petty Cash",
          "submenu": [
            {
              "icon": "visibility",
              "name": "Data Capture",
              "route": "/App/create-requisition",
              "routeParameters": {}
            },
          ]
        },
        {
          "name": "CB - Receipts",
          "submenu": [
            {
              "icon": "visibility",
              "name": "Data Capture",
              "route": "/App/create-requisition",
              "routeParameters": {}
            },
          ]
        },
        {
          "name": "CB - Reconciliations",
          "submenu": [
            {
              "icon": "visibility",
              "name": "Data Capture",
              "route": "/App/create-requisition",
              "routeParameters": {}
            },
          ]
        },
        {
          "name": "CB - Inquiries",
          "submenu": [
            {
              "icon": "visibility",
              "name": "Data Capture",
              "route": "/App/create-requisition",
              "routeParameters": {}
            },
          ]
        },
      ]
    },
    {
      "menuname": "Debtors",
      "iconname": "trending_up",
      "submenuclass": [
        {
          "name": "Customer Accounts",
          "submenu": [
            {
              "icon": "person",
              "name": "Customer Ledger",
              "route": "/App/customer-ledger",
              "routeParameters": {}
            },
            {
              "icon": "list",
              "name": "Aging Report",
              "route": "/App/debtors-aging",
              "routeParameters": {}
            },
            {
              "icon": "search",
              "name": "Account Inquiry",
              "route": "/App/debtor-inquiry",
              "routeParameters": {}
            }
          ]
        },
        {
          "name": "Invoicing",
          "submenu": [
            {
              "icon": "receipt",
              "name": "Create Invoice",
              "route": "/App/create-invoice",
              "routeParameters": {}
            },
            {
              "icon": "edit",
              "name": "Modify Invoice",
              "route": "/App/modify-invoice",
              "routeParameters": {}
            },
            {
              "icon": "print",
              "name": "Print Invoices",
              "route": "/App/print-invoices",
              "routeParameters": {}
            }
          ]
        },
        {
          "name": "Collections",
          "submenu": [
            {
              "icon": "payment",
              "name": "Record Payment",
              "route": "/App/record-payment",
              "routeParameters": {}
            },
            {
              "icon": "warning",
              "name": "Overdue Accounts",
              "route": "/App/overdue-accounts",
              "routeParameters": {}
            },
            {
              "icon": "email",
              "name": "Send Reminders",
              "route": "/App/send-reminders",
              "routeParameters": {}
            }
          ]
        }
      ]
    },
    // {
    //   "menuname": "Debtors",
    //   "iconname": "business_center",
    //   "submenuclass": [
    //     {
    //       "name": "New Business",
    //       "submenu": [
    //         {
    //           "icon": "visibility",
    //           "name": "Data Capture",
    //           "route": "/App/NewProposal",
    //           "routeParameters": {}
    //         },
    //         {
    //           "icon": "visibility",
    //           "name": "Convert to Proposal",
    //           "route": "/App/ConvertProposal",
    //           "routeParameters": {}
    //         },
    //         {
    //           "icon": "visibility",
    //           "name": "Convert to Policy",
    //           "route": "",
    //           "routeParameters": {}
    //         },
    //         {
    //           "icon": "visibility",
    //           "name": "Authorize Policy",
    //           "route": "/App/authorize-proposals",
    //           "routeParameters": {}
    //         },
    //       ]
    //     },
    //     {
    //       "name": "create-requisition",
    //       "submenu": [
    //         {
    //           "icon": "visibility",
    //           "name": "Data Capture",
    //           "route": "/App/create-requisition",
    //           "routeParameters": {}
    //         },
    //       ]
    //     },
    //   ]
    // },
    // {
    //   "menuname": "Creditors",
    //   "iconname": "party_mode",
    //   "submenuclass": [
    //     {
    //       "name": "New Business",
    //       "submenu": [
    //         {
    //           "icon": "visibility",
    //           "name": "Data Capture",
    //           "route": "/App/NewProposal",
    //           "routeParameters": {}
    //         },
    //         {
    //           "icon": "visibility",
    //           "name": "Convert to Proposal",
    //           "route": "/App/ConvertProposal",
    //           "routeParameters": {}
    //         },
    //         {
    //           "icon": "visibility",
    //           "name": "Convert to Policy",
    //           "route": "",
    //           "routeParameters": {}
    //         },
    //         {
    //           "icon": "visibility",
    //           "name": "Authorize Policy",
    //           "route": "/App/authorize-proposals",
    //           "routeParameters": {}
    //         },
    //       ]
    //     },
    //     {
    //       "name": "create-requisition",
    //       "submenu": [
    //         {
    //           "icon": "visibility",
    //           "name": "Data Capture",
    //           "route": "/App/create-requisition",
    //           "routeParameters": {}
    //         },
    //       ]
    //     },
    //   ]
    // },
    {
      "menuname": "Creditors",
      "iconname": "trending_down",
      "submenuclass": [
        {
          "name": "Supplier Accounts",
          "submenu": [
            {
              "icon": "business",
              "name": "Supplier Ledger",
              "route": "/App/supplier-ledger",
              "routeParameters": {}
            },
            {
              "icon": "list",
              "name": "Aging Report",
              "route": "/App/creditors-aging",
              "routeParameters": {}
            },
            {
              "icon": "search",
              "name": "Account Inquiry",
              "route": "/App/creditor-inquiry",
              "routeParameters": {}
            }
          ]
        },
        {
          "name": "Purchase Orders",
          "submenu": [
            {
              "icon": "shopping_cart",
              "name": "Create Purchase Order",
              "route": "/App/create-po",
              "routeParameters": {}
            },
            {
              "icon": "edit",
              "name": "Modify Purchase Order",
              "route": "/App/modify-po",
              "routeParameters": {}
            },
            {
              "icon": "check_circle",
              "name": "Approve Purchase Order",
              "route": "/App/approve-po",
              "routeParameters": {}
            }
          ]
        },
        {
          "name": "Payments",
          "submenu": [
            {
              "icon": "payment",
              "name": "Record Payment",
              "route": "/App/record-supplier-payment",
              "routeParameters": {}
            },
            {
              "icon": "schedule",
              "name": "Payment Schedule",
              "route": "/App/payment-schedule",
              "routeParameters": {}
            },
            {
              "icon": "check",
              "name": "Authorize Payments",
              "route": "/App/authorize-payments",
              "routeParameters": {}
            }
          ]
        }
      ]
    }
    ]
  }

  async setMenuInfo(){

    let menuendpoint = ''//environment.baseURL+ "bootstrap";
    let postData = {
      email:"",
      applicationId:""
    }
    this.setCurrentActiveSubMenu(0);
    // await this._httpClient.post<any>(menuendpoint, postData).toPromise().then(
    //   (response:any)=>{
    //     this.menuitems = JSON.parse(response.data);
    //     var item = this.menuitems.find(x => x.menuname == "Transaction");
    //     if(item == null){
    //       item = new MenuIcon("test","test",[]);
    //     }
    //       item.submenuclass[0].submenu[0].route = "/underwriting/dcnote";
    //   } ,
    //   (error : HttpErrorResponse)=>{
    //       //this._toastr.error("Error fetching Menu information", "Error",{ closeButton:true, disableTimeOut:true });
    //   }
    // );
    return  this.menuitems;
  }



  setCurrentActiveSubMenu(index:number){
    var icons = document.getElementsByClassName("main-menu-icon") as HTMLCollection;
    for(let count = 0; count < icons.length ; count++ ){
      icons[count].classList.remove("active-menu");
    }
    icons.item(index)?.classList.add("active-menu");
    this.activeSubmenu = this.menuitems[index];
  }




}
