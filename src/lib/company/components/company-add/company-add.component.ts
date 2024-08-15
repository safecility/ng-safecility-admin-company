import {Component, EventEmitter, Output} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup, ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {map, of, Observable} from "rxjs";
import {CompanyEmit, CompanyService, NewCompany} from "../../company.service";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'lib-company-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatError,
    MatSelect,
    MatOption,
    MatLabel,
    NgIf,
    JsonPipe
  ],
  templateUrl: './company-add.component.html',
  styleUrl: './company-add.component.css'
})
export class CompanyAddComponent {

  addForm: FormGroup;

  previousEmit: NewCompany | undefined;

  @Output() value = new EventEmitter<CompanyEmit | undefined>();

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
  ) {
    this.addForm = this.formBuilder.group({
      name: ["", Validators.required],
      uid: ["", [Validators.required], [this.uniqueUid()]],
      active: [false],
    });

    this.addForm.valueChanges.subscribe( x => {
      this.updateValue();
    })

    this.addForm.statusChanges.subscribe( x => {
      if (!x)
        return;
      this.updateValue();
    })
  }

  get name(): FormControl<string> {
    return <FormControl<string>>this.addForm.get('name'); }

  get uid(): FormControl<string> {
    return <FormControl<string>>this.addForm.get('uid'); }

  uniqueUid(): AsyncValidatorFn {
    return (ac: AbstractControl): Observable<ValidationErrors | null> => {
      const uid = ac.getRawValue();
      if (!uid)
        return of({uidInvalid: uid})
      return this.companyService.uidExists(uid).pipe(
        map(x => {
          if (!x)
            return null
          console.log("exists", x)
          return {uidExists: uid}
        })
      )
    }
  }

  updateValue() {
    if (this.previousEmit === this.addForm.value)
      return;
    this.previousEmit = this.addForm.value;
    //this might be the async validators fault but something goes wrong if you accept previously entered values
    this.addForm.updateValueAndValidity({onlySelf: true, emitEvent: false})
    let emitValue: CompanyEmit = {company: this.addForm.value, valid: this.addForm.valid};
    this.value.next(emitValue);
  }

}
