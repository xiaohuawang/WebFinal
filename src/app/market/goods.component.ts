import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpClient } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { AppState } from '../app.service';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


/**
 * goods page for seller
 */
@Component({
  selector: 'MarketComponent',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css']
})
export class MarketComponent implements OnInit {
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

  constructor(
    http: HttpClient,
    cookies: CookieService,
    state: AppState,
    formBuilder: FormBuilder,
    route: Router,
    private sanitizer: DomSanitizer
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
    this.sanitizer = sanitizer;
  }

  async ngOnInit() {
    const FETCH_TYPE = {
      "BOUGHT": 0,
      "SELL": 1,
      "ALL_ON_SALE": 2
    }
    this.disabled = true;
    this.buttonContent = "Edit";
    this.isEditMode = false;
    await this.http.get("api/users/profile", {}).subscribe({
      next: (resp: any) => {
        this.currentProfile = resp;
        console.log(this.currentProfile)
      }
    })
    
    this.http.get("/api/goods?type=2", {
    })
      .subscribe({
        next: (va: any) => {
          if (!va) {
            this.route.navigate(["/login"]);
          }
          console.log(va);
          this.goodsList = va;
          this.goodsList.forEach(good => {
            good.href = '/goods/' + good._id;
            good.status = good.status==1? "onSale": "Sold to" + good.buyer.username;
            good.imgstyle = good.imgSrc;
            this.sanitizer.bypassSecurityTrustStyle(good.imgstyle)
            if (this.currentProfile.cart.includes(good._id)) {
              good.isFavorite = true;
            } else {
              good.isFavorite = false;
            }
          })
          console.log(this.goodsList)
          // get new data
        }, error: (errors) => {
          console.log('there was an error sending the query', errors);
          console.log("login failed")
        }
      });

  }



  addToCart(_id) {
    if (!this.isEditMode) {
      this.http.patch("/api/users/addToCart", {_id: _id}).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.goodsList.forEach(good => {
            if (resp.cart.includes(good._id)) {
              good.isFavorite = true;
            } else {
              good.isFavorite = false;
            }
          })
          alert("add to cart success")
        },
        error: () => { }
      })
    }
  }
}
