class MenuIcon{
    menuname:string;
    iconname:string;
    submenuclass :SubmenuClass[];
    constructor( menuDisplayName :string, iconName:string, submenuclass:SubmenuClass[]){
        this.menuname = menuDisplayName ;
        this.iconname = iconName;
        this.submenuclass = submenuclass;
        
    }
}

class Submenu
    {
        route:string;
        icon:string;
        name:string;
        routeParameters?:any

        constructor(route:string,icon:string,name:string, routeParameters:any = {}){
            this.icon = icon;
            this.name = name;
            this.route = route;
            this.routeParameters = routeParameters
        }
    }

class SubmenuClass
    {
        name:string;
        submenu:Submenu[];

        constructor( name:string, submenu:Submenu[]) {
           this.name = name;
           this.submenu = submenu;            
        }
    }

   
export default MenuIcon;
export { 
    
            Submenu,
            SubmenuClass
        }