import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import {HttpClient} from "@angular/common/http";

import { AddUserMutation } from '../grahql/mutations';


@Component({
  selector: 'registe-component',
  templateUrl: './registe.component.html'
})
export class RegisteComponent {
    currentProfile: any;
    form: FormGroup;

    constructor(
      formBuilder: FormBuilder,
      private apollo: Apollo,
      private router: Router,
      private http: HttpClient
  ) {
      this.form = formBuilder.group({
          userName: ['', [
            Validators.required,
          ]],
          email: ['', [
            Validators.required,
          ]],
          password: ['', [
            Validators.required,
          ]],
          confirmPassword: ['', [
            Validators.required,
          ]],
          status: ['', [Validators.required]]
      });
      this.apollo = apollo;  
      this.currentProfile = {}
      this.http = http
  }
  
    ngOnInit() {
    }

    isInvalid (str) {
      return str == null || str == undefined
    }
    public registe() {
        if (!this.form.valid) {
          for (let m in this.form.value) {
            if (this.isInvalid(this.form.value[m])) {
              alert(`${m} is invalid!`);
              return;
            }
            if (this.form.value.password !== this.form.value.confirmPassword) {
              alert('Passwords you inputed are not the same')
            }
          }
          console.log(this.form);
        };
        if (!this.form.value.email.includes('@')) {
          alert('Email should be like "example@a.com"')
          return;
        }
        console.log('registe...')
        console.log(this.form.value)
        this.http.post("/api/users", {
              "username": this.form.value.userName,
              "email" :this.form.value.email,
              "password": this.form.value.password,
              "status": this.form.value.status? 2: 3
        })
        .subscribe({
            next: (va) => {
              // get new data      
              this.router.navigate(['/login']);
            }, error: (errors) => {
              alert('Registe failed, username might be used')
            }
          });
    }

}
