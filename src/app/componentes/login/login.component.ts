import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, addDoc,collectionData } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { getDatabase } from 'firebase/database';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public loginsCollections: any[] = [];
  public countLogins: number = 0;
  private sub!:Subscription // Armar array de suscripciones para luego recorrerlo y en el OnDestroy nos desuscribimos de todos con un for
  public userMail: string = "";
  public userPWD: string = "";
  public loggedUser: string = "";

  constructor(private router: Router, private auth: AuthService)
  {

  }

  Login()
  {
    this.auth.Login(this.userMail, this.userPWD);  
  }

  CloseSession()
  {
    this.auth.CloseSession();
  }

  goTo(path: string)
  {
    this.router.navigate([path]);
  }

  AccesoRapido()
  {
    this.userMail = "admin@gmail.com";
    this.userPWD = "admin123";
  }
  /*OnDestroy
  {
    this.sub.unsuscribe();
  }*/
}
