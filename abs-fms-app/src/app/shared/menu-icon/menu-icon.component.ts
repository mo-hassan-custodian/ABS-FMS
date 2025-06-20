import { Component, Input } from '@angular/core';
import MenuIcon from '../../models/menu-icon';

@Component({
  selector: 'app-menu-icon',
  templateUrl: './menu-icon.component.html',
  styleUrls: ['./menu-icon.component.css']
})
export class MenuIconComponent {
  @Input() menuicon !: MenuIcon;
}
