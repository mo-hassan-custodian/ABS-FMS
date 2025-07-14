import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import MenuIcon from '../../models/menu-icon';
import { MenuService } from '../../services/dashboard-service/menu/menu.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'],
    standalone: false
})
export class LayoutComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  showProgressBar = false
  userProfile:any;
  myDate = new Date();
  hrs = this.myDate.getHours();
  mins = this.myDate.getMinutes();
  greet:string = '';
  userId:String='';

  public menuitems:MenuIcon[] = [];
  public activeSubMenu?:MenuIcon;

  constructor(public _menuservice:MenuService,) {
    
    this.showProgressBar = true;
    
    
  }
  ngOnInit(): void {
    this._menuservice.setMenuInfo().then(
      (menuResponse:MenuIcon[]) => {
        this.menuitems = menuResponse;
          this.showProgressBar = false;
      }       
   ); 
   this.getTimeStatus();
  }

  getTimeStatus () {
    if (this.hrs >= 5 && ((this.hrs == 5 && this.mins >= 30) || (this.hrs > 5 && this.hrs < 12))){
      this.greet = 'Good Morning';
    
    }

else if (this.hrs >= 12 && this.hrs < 16) {
  this.greet = 'Good Afternoon';
 
}

else if ((this.hrs >= 16 && this.hrs < 24) || this.hrs > 0) {
  this.greet = 'Good Evening';

}

else {
 this.greet = 'Welcome';
}
  
  }


  logout() {
    localStorage.clear();
  }

  onMenuClick(itemIndex: number): void {
    this._menuservice.setCurrentActiveSubMenu(itemIndex);

    // Check if we're on mobile
    if (this.isMobile()) {
      // On mobile, open the drawer in overlay mode
      if (this.drawer.opened) {
        this.drawer.close();
      } else {
        this.drawer.open();
      }
    } else {
      // On desktop, just open the drawer
      this.drawer.open();
    }
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  onSubmenuItemClick(): void {
    // Close drawer when submenu item is clicked (especially useful on mobile)
    if (this.drawer && this.drawer.opened) {
      this.drawer.close();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    // Close drawer on resize to desktop to avoid layout issues
    if (!this.isMobile() && this.drawer && this.drawer.opened) {
      this.drawer.close();
    }
  }
}
