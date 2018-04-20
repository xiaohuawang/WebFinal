import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { HttpClient } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'login-component',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    currentProfile: any;
    form: FormGroup;

    constructor(
        formBuilder: FormBuilder,
        private apollo: Apollo,
        private http: HttpClient,
        private router: Router,
        private cookies: CookieService,
    ) {
        this.form = formBuilder.group({
            userName: ['', [
                Validators.required,
            ]],
            password: ['']
        });
        this.apollo = apollo;
        this.currentProfile = {};
        this.http = http;
        this.router = router;
        this.cookies = cookies;
    }

    ngOnInit() {
        $(document).ready(function(){
	
            $('input[type=password]').keyup(function() {
                var pswd = $(this).val();
                
                //validate the length
                if ( pswd.length < 8 ) {
                    $('#length').removeClass('valid').addClass('invalid');
                } else {
                    $('#length').removeClass('invalid').addClass('valid');
                }
                
                //validate letter
                if ( pswd.match(/[A-z]/) ) {
                    $('#letter').removeClass('invalid').addClass('valid');
                } else {
                    $('#letter').removeClass('valid').addClass('invalid');
                }
        
                //validate capital letter
                if ( pswd.match(/[A-Z]/) ) {
                    $('#capital').removeClass('invalid').addClass('valid');
                } else {
                    $('#capital').removeClass('valid').addClass('invalid');
                }
        
                //validate number
                if ( pswd.match(/\d/) ) {
                    $('#number').removeClass('invalid').addClass('valid');
                } else {
                    $('#number').removeClass('valid').addClass('invalid');
                }
                
                //validate space
                if ( pswd.match(/[^a-zA-Z0-9\-\/]/) ) {
                    $('#space').removeClass('invalid').addClass('valid');
                } else {
                    $('#space').removeClass('valid').addClass('invalid');
                }
                
            }).focus(function() {
                $('#pswd_info').show();
            }).blur(function() {
                $('#pswd_info').hide();
            });
            
        });
    }

    login() {
        if (!this.form.valid) {
            for (let m in this.form.value) {
                if (!this.form.value[m]) {
                    alert(`${m} is invalid!`);
                    return;
                }
                alert('Inputs can not be blank')
                return;
            }
            console.log(this.form);
        };
        console.log('registe...')
        this.http.post("/api/auth/login", {
            "username": this.form.value.userName,
            "password": this.form.value.password
        })
            .subscribe({
                next: (va: any) => {
                    console.log('got a new post', va);
                    this.cookies.set("token", va.token)
                    // get new data
                    this.router.navigate(['/profile']);
                    window.location.reload();
                }, error: (errors) => {
                    console.log('there was an error sending the query', errors);
                    alert("login failed")
                }
            });
        console.log('login...')
    }

}
