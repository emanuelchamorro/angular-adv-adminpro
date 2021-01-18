import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private userService:UsuarioService, private router:Router ) {}
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    return this.userService.validarToken()
    .pipe(
      tap(autenticado => {
        if(!autenticado) {
         this.router.navigateByUrl('/login')
        }
      })
    );
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    
    /*es equivalente a que retorne true, porque validarToken() fue transormado en
     booleano con el metodo map*/
    return this.userService.validarToken()
                           .pipe(
                             tap(autenticado => {
                               if(!autenticado) {
                                this.router.navigateByUrl('/login')
                               }
                             })
                           );
  }
  
}
