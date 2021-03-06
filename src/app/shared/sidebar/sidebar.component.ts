import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
 

  public menuItems: any[];
  public usuario: Usuario;
  public toggle:boolean=false
  public toggle2:boolean=false

  constructor(public sidebarService: SidebarService, private userService: UsuarioService) {
    //this.menuItems = sbService.menu;
    this.usuario = userService.usuario;
    
   }

  ngOnInit(): void {
  }


}
