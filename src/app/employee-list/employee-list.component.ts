import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { Employee } from '../models/Employee';

const get_employees = gql`
  query {
    getAllEmployees {
      id
      first_name
      last_name
      email
      gender
      salary
    }
  }`;

const delete_employee = gql`
  mutation deleteEmployeeByEid($deleteEmployeeId: String!) {
    deleteEmployeeByEid(id: $deleteEmployeeId) {
      id
      first_name
      last_name
      email
      gender
      salary
    }
  }
  `;


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  isLoading!: boolean;
  title = '101345468_comp3133_assig2';
  error: any;
  constructor(private apollo: Apollo) {}
  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: get_employees,
      })
      .valueChanges.subscribe(({ data, loading}) => {
        this.isLoading = loading;
        console.log(this.isLoading);
        this.employees = data.getAllEmployees;
        console.log(data.getAllEmployees);
      });
  }

  onDeleteEmployeeButtonClick (id: String) {
    this.apollo
      .mutate<any>({
        mutation: delete_employee,
        variables: {
          "deleteEmployeeId": id,
        },
      })
      .pipe(
        catchError((error) => {
          this.error = error.message;
          if (error.networkError.status === 400)
            this.error = 'Error, cannot function';
          return of({ error: error });
        })
      )
      .subscribe((data) => {
        window.location.href = '/list';
      });
  }
}
