import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/dashboard-service/menu/menu.service';
import MenuIcon from '../../models/menu-icon';

interface Activity {
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menuItems: MenuIcon[] = [];
  activeMenu: MenuIcon | null = null;

  recentActivities: Activity[] = [
    {
      icon: 'add_circle',
      title: 'New Policy Created',
      description: 'Motor insurance policy for John Doe - Policy #POL-2024-001',
      time: '2 hours ago',
      color: '#4caf50'
    },
    {
      icon: 'payment',
      title: 'Premium Payment Received',
      description: 'Payment of ₦150,000 received from ABC Company Ltd',
      time: '4 hours ago',
      color: '#2196f3'
    },
    {
      icon: 'assignment',
      title: 'Claim Processed',
      description: 'Motor claim #CLM-2024-045 approved and processed',
      time: '6 hours ago',
      color: '#ff9800'
    },
    {
      icon: 'person_add',
      title: 'New Customer Registered',
      description: 'Sarah Johnson registered as new customer',
      time: '1 day ago',
      color: '#9c27b0'
    },
    {
      icon: 'receipt',
      title: 'Invoice Generated',
      description: 'Invoice #INV-2024-234 generated for renewal premium',
      time: '1 day ago',
      color: '#607d8b'
    }
  ];

  constructor(
    private menuService: MenuService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  async loadMenuItems() {
    try {
      this.menuItems = await this.menuService.setMenuInfo();
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  }

  toggleSubmenu(menuItem: MenuIcon) {
    if (this.activeMenu === menuItem) {
      this.activeMenu = null;
    } else {
      this.activeMenu = menuItem;
    }
  }

  navigateToRoute(route: string) {
    if (route) {
      console.log('Navigating to:', route);
      this.router.navigate([route]);
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getLastLoginTime(): string {
    // This would typically come from a service or localStorage
    const lastLogin = new Date();
    lastLogin.setHours(lastLogin.getHours() - 2); // Simulate 2 hours ago
    return lastLogin.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getLastBackupTime(): string {
    const lastBackup = new Date();
    lastBackup.setDate(lastBackup.getDate() - 1); // Yesterday
    return lastBackup.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  navigateToModule(module: string): void {
    console.log(`Navigating to module: ${module}`);

    // Map module names to actual routes
    const moduleRoutes: { [key: string]: string } = {
      'new-policy': '/App/new-policy',
      'process-claim': '/App/process-claim',
      'customer-search': '/App/customer-search',
      'payment-entry': '/App/payment-entry'
    };

    const route = moduleRoutes[module];
    if (route) {
      this.router.navigate([route]);
    } else {
      console.warn(`Route not found for module: ${module}`);
      // For now, just show an alert
      alert(`${module} module will be available soon!`);
    }
  }
}
