import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/dashboard-service/menu/menu.service';
import MenuIcon from '../../models/menu-icon';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menuItems: MenuIcon[] = [];
  activeMenu: MenuIcon | null = null;

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
      // You can implement actual navigation here
      // this.router.navigate([route]);
    }
  }
}
