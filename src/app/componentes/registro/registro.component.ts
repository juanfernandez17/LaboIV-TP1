import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent {

  newUserMail: string = "";
  newUserPWD: string = "";

  constructor(private router: Router, private auth: AuthService, private toast: ToastrService) {

  }

  Register()
  {
    this.auth.Register(this.newUserMail, this.newUserPWD);
  }

  goTo(path: string) 
  {  
    this.router.navigate([path]);
  }
}