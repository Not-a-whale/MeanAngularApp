import { NgModule } from '@angular/core';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../app.angular-material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule],
})
export class AuthModule {}
