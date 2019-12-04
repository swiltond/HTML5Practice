import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { EmployeeModel } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { MyErrorStateMatcher } from '../app.errorStateMatcher';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {
  errors: any;
  empID: string;

  constructor(
    private empSrv: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  employee: EmployeeModel;
  public empEditForm: FormGroup;
  reqData: { name: any; salary: any; age: any };

  matcher = new MyErrorStateMatcher();

  ngOnInit() {
    this.employee = history.state.data;

    this.empEditForm = new FormGroup({
      empIDControl: new FormControl({
        value: this.employee.id,
        disabled: true
      }),
      empNameControl: new FormControl(this.employee.employee_name, [
        Validators.required
      ]),
      empAgeControl: new FormControl(this.employee.employee_age, [
        Validators.required,
        Validators.min(1),
        Validators.max(100)
      ]),
      empSalaryControl: new FormControl(this.employee.employee_salary, [
        Validators.required
      ])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.empEditForm.controls[controlName].hasError(errorName);
  }

  updateEmp(elementID: string) {
    this.reqData = {
      name: this.empEditForm.value.empNameControl,
      salary: this.empEditForm.value.empSalaryControl,
      age: this.empEditForm.value.empAgeControl
    };

    this.empSrv.updateEmployee(elementID, this.reqData).subscribe(() => {
      this.snackBar.open('Employee updated successfully', '', { duration: 4000 });
    });
  }

  findEmp(empID: any) {

    this.empID = empID.value;

    this.empSrv.findEmployee(this.empID).subscribe(
      resData => {
        empID.value = '';
        this.employee = resData;
        this.empEditForm.patchValue({
          empIDControl: this.employee.id,
          empNameControl: this.employee.employee_name,
          empAgeControl: this.employee.employee_age,
          empSalaryControl: this.employee.employee_salary
        });
      },
      error => {
        this.errors = error;
        this.snackBar.open('Employee not found', '', {
          duration: 4000
        });
      }
    );
  }
}
