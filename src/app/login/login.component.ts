import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const login = gql`
  query Query($username: String!, $password: String!, $email: String!) {
    login(username: $username, password: $password, email: $email) {
      email
      id
      password
      username
    }
  }
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [true],
    });
  }

  onSubmit() {
    this.apollo
      .watchQuery<any>({
        query: login,
        variables: {
          username: this.form.value.username,
          password: this.form.value.password,
          email: this.form.value.email,
        },
      })
      .valueChanges.subscribe(({ data, loading }) => {
        let button = document.getElementById('submit') as HTMLButtonElement;        
        while (loading != false) {
          button!.textContent = '';
          button!.disabled = true;
          button!.innerHTML =
            "<div class='d-flex justify-content-center align-items-center'><div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>&nbsp; &nbsp;Please Wait...</div>";
        }
        if (data.login.email) {
          const user = {
            username: this.form.value.username,
            password: this.form.value.password,
            email: this.form.value.email,
          };
          if (this.form.value.rememberMe == true) {
            localStorage.setItem('employee-system', JSON.stringify(user));
          } else if (this.form.value.rememberMe == false) {
            sessionStorage.setItem('employee-system', JSON.stringify(user));
          }
          this.router.navigate(['/list']);
        }
        button!.disabled = false;
        button!.innerHTML = 'LOGIN';
      });
  }
}