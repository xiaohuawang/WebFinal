import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import {HttpClient} from "@angular/common/http";

import { AddUserMutation } from '../grahql/mutations';


@Component({
  selector: 'addGoods-component',
  templateUrl: './addGoods.component.html'
})
export class AddGoodsComponent {
    currentProfile: any;
    form: FormGroup;

    constructor(
      formBuilder: FormBuilder,
      private apollo: Apollo,
      private router: Router,
      private http: HttpClient
  ) {
      this.form = formBuilder.group({
          name: ['', [
            Validators.required,
          ]],
          description: ['', [
            Validators.required,
          ]],
          imgSrc: ['', [
          ]],
          price: ['', [
          ]],
      });
      this.apollo = apollo;  
      this.currentProfile = {}
      this.http = http
      this.router = router;
  }
  
    ngOnInit() {
    }

    public addGoods() {
        if (!this.form.valid) {
          for (let m in this.form.value) {
            if (!this.form.value[m]) {
              alert(`${m} is invalid!`);
              return;
            }
            if (this.form.value.password !== this.form.value.confirmPassword) {
              alert('Passwords you inputed are not the same')
            }
          }
          console.log(this.form);
        };
        console.log('addGoods...')
        console.log(this.form.value)
        this.http.post("/api/goods", {
              "name": this.form.value.name,
              "description" :this.form.value.description,
              "price": this.form.value.price,
              'imgSrc': this.form.value.imgSrc
        })
        .subscribe({
            next: (va) => {
              // get new data      
              this.router.navigate(['goods'])
            }, error: (errors) => {
              alert('addGoods failed, username might be used, or you did not login')
            }
          });
    }

}
