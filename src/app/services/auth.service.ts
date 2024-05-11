import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { Firestore, collection, addDoc,collectionData } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loginsCollections: any[] = [];
  public countLogins: number = 0;
  private sub!:Subscription // Armar array de suscripciones para luego recorrerlo y en el OnDestroy nos desuscribimos de todos con un for
  public userMail: string = "";
  public userPWD: string = "";
  public loggedUser: any = "";
  public currentUser!: any;
  public logged: boolean = false;
  flagError: boolean = false;
  msjError: string = "";
  
  constructor(private router: Router, private firestore: Firestore, public auth: Auth, private toastr: ToastrService)
  {
  
  }

  Login(userMail: string, userPWD: string)
  {    
    signInWithEmailAndPassword(this.auth, userMail, userPWD).then((res) => {
     
      if (res.user.email !== null) this.loggedUser = res.user.email;
 
      this.logged = true;
    
      let col = collection(this.firestore, 'logins');
      addDoc(col, {"usuario": userMail, fecha: new Date()})
      this.goTo('home');
    }).catch((e) => {

      switch (e.code) {
        case "auth/invalid-email":
          this.msjError = "Email invalido";
          break;
        case "auth/email-already-in-use":
          this.msjError = "Email ya registrado";
          break;
        case "auth/invalid-credential":
          this.msjError = "Email y/o contraseña incorrecto"
          break;
        default:
          this.msjError = e.code
          break;
      }
      console.log(e.code);
      this.toastr.error(this.msjError,"Error");
    })
  }

  GetData()
  {
    let col = collection(this.firestore,"logins");
    const observable = collectionData(col);

    this.sub = observable.subscribe((respuesta:any) =>{
      this.loginsCollections = respuesta;
      this.countLogins = this.loginsCollections.length;      
    })
  }

  CloseSession(){
    signOut(this.auth).then(() => {
      this.goTo('login');
    })
  }

  Register(newUserMail: string, newUserPWD: string) {
    createUserWithEmailAndPassword(this.auth, newUserMail, newUserPWD).then((res) => {
      if (res.user.email !== null) this.loggedUser = res.user.email;

      this.flagError = false;
      this.goTo('home');
      this.toastr.success("Cuenta creada con exito!", "Bienvenido");
    }).catch((e) => {
      this.flagError = true;

      switch (e.code) {
        case "auth/invalid-email":
          this.msjError = "Email invalido";
          break;
        case "auth/email-already-in-use":
          this.msjError = "Email ya registrado";
          break;
        case "auth/weak-password":
          this.msjError = "La contraseña debe tener más de 6 caracteres";
          break;
        default:
          this.msjError = e.code
          break;
      }
      console.log(this.msjError);
      this.toastr.error(this.msjError, "Error!");
    });
  }

  isLogged()
  {       
    if(this.auth.currentUser?.email == null)
    {
      this.logged = false; 
    }
    else
    {
      
      this.logged = true;
    }
    
    return this.logged;
  }

  goTo(path: string) {    
    this.router.navigate([path]);
  } 
}
