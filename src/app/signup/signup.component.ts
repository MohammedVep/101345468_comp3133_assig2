import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';

const signup = gql`
  mutation signUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      id
      username
      email
      password
      
    }
  }
`;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  error: any;
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.apollo
      .mutate<any>({
        mutation: signup,
        variables: {
          username: this.form.value.username,
          password: this.form.value.password,
          email: this.form.value.email
        },
      })
      .pipe(
        catchError((error) => {
          this.error = error.message;
          if (error.networkError.status === 400)
            this.error = 'Bad Request has been made';
          return of({ error: error });
        })
      )
      .subscribe({
        next: (val: any) => {

          this.router.navigate(["/login"])

        }
      })
  }

}
