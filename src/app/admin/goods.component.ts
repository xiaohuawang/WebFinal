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
export class AdminComponent implements OnInit {
  currentProfile: any;
  http: HttpClient
  state: AppState;
  cookies: CookieService;
  isEditMode: Boolean;
  buttonContent: String;
  form: FormGroup;
  disabled: boolean;
  route: Router;
  users: Array<any>;

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
    this.http.get("/api/users", {
    })
      .subscribe({
        next: (va: any) => {
          if (!va) {
            this.route.navigate(["/login"]);
          }
          console.log(va);
          this.users = va;
          this.users.forEach(user => {
          })
          // get new data
        }, error: (errors) => {
          console.log('there was an error sending the query', errors);
          console.log("login failed")
        }
      });
  }

  change(user, _type) {
    let a = window.prompt(`Would you like to change user ${user.username}'s ${_type}?`, `${user[_type]}`);
    if (null===a) {return }
    user[_type] = a;
      this.http.put("/api/users/" + user._id, user).subscribe({
        next: (resp) => {
          console.log(resp);
          this.users.find(us => us._id === user._id)[_type] = a;
        },
        error: () => { }
      })
    }
}
