import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpClient } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { AppState } from '../app.service';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * goods page for seller
 */
@Component({
  selector: 'cart',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css']
})
export class CartComponent implements OnInit {
  currentProfile: any;
  http: HttpClient
  state: AppState;
  cookies: CookieService;
  isEditMode: Boolean;
  buttonContent: String;
  form: FormGroup;
  disabled: boolean;
  route: Router;
  goodsList: Array<any>;
  money: number

  constructor(
    http: HttpClient,
    cookies: CookieService,
    state: AppState,
    formBuilder: FormBuilder,
    route: Router
  ) {
    this.currentProfile = {};
    this.cookies = cookies;
    this.state = state;
    this.http = http;
    this.form = formBuilder.group({
      userName: ['', [
        Validators.required,
      ]],
      description: ['', [
        Validators.required
      ]]
    });
    this.route = route;
  }

  ngOnInit() {
    const FETCH_TYPE = {
      "BOUGHT": 0,
      "SELL": 1,
      "ALL_ON_SALE": 2
    }
    this.money = 0;
    this.disabled = true;
    this.http.get("/api/users/cart", {
    })
      .subscribe({
        next: (resp: any) => {
          console.log(resp)
          let va = resp.cart;
          if (!va) {
            this.route.navigate(["/login"]);
          }
          console.log(va);
          this.goodsList = va;
          this.goodsList.forEach(good => {
            good.href = '/goods/' + good._id;
            good.status = good.status==1? "onSale": "Sold to: " + good.buyer.username
            this.money += good.price;
          })
        // get new data
        }, error: (errors) => {
          console.log('there was an error sending the query', errors);
          console.log("login failed")
        }
      });
  }

  goToMarket() {
    this.route.navigate(['market']);
  }

  remove(_id) {
    this.http.patch("/api/users/removeFromCart", {_id: _id}).subscribe({
      next: (resp: any) => {
        console.log(this.goodsList)
        console.log(_id)
        this.money = this.money - this.goodsList.find(a => a._id === _id).price;
        this.goodsList = this.goodsList.filter(good => {return good._id !== _id});
        console.log(this.goodsList)
        alert("success")
      },
      error: () => { }
    })
  }

  checkout() {
    this.http.patch("/api/users/checkout", {
      
    }).subscribe({
      next: (resp: any) => {
        console.log(this.goodsList);
        this.route.navigate(['profile']);
      },
      error: () => {
        alert('checkout failed')
      }
    })
  }

  clickBtn(username, email, description) {
    username = username.trim();
    this.isEditMode = !this.isEditMode;
    this.buttonContent = this.isEditMode ? "Submit" : "Edit";
    if (!this.isEditMode) {
      this.currentProfile.description = description;
      let needRefresh = this.currentProfile.username !== username;
      this.currentProfile.username = username;
      this.currentProfile.email = email
      console.log(this.currentProfile)
      this.http.put("/api/users/" + this.currentProfile._id, this.currentProfile).subscribe({
        next: (resp) => {
          console.log(resp);
          if (needRefresh) {
            this.route.navigate(["/login"]);
          }
        },
        error: () => { }
      })
    }
  }
}
