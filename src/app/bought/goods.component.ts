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
  selector: 'goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css']
})
export class BoughtComponent implements OnInit {
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
    this.disabled = true;
    this.buttonContent = "Edit";
    this.isEditMode = false;
    this.http.get("/api/goods?type=0", {
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
            good.status = good.status==1? "onSale": "Sold to: " + good.buyer.username
          })
          // get new data
        }, error: (errors) => {
          console.log('there was an error sending the query', errors);
          console.log("login failed")
        }
      });

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
