import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class AdminGuard implements CanActivate {
  
    constructor( private userService: UserService,
                 private router: Router) {}
  
      canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let rol:any;
      this,this.userService.user$.subscribe((user: User) => {
        rol = user.User_Rol;
      });
      console.log(rol); // Asume que el rol del usuario está almacenado con la clave 'rol'
      
      if (rol === 1) {
        // Si el usuario es un admin, permite el acceso
        // console.log('Es admin');
        return true;
      } else {
        // Si el usuario no es un admin, redirige a alguna otra página, como la página de inicio de sesión
        this.router.navigate(['/dataset/lista']);
        return false;
      }
    }
    
  }
