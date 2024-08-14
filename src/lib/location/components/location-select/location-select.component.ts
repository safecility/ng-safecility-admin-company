import {Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder, FormControl,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";

import {Location} from "../../location.model";
import {NgForOf} from "@angular/common";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {FocusMonitor} from "@angular/cdk/a11y";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {Subject} from "rxjs";
import {MatFormFieldControl} from "@angular/material/form-field";
import {LocationsService} from "../../locations.service";

@Component({
  selector: 'lib-location-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatOption,
    MatSelect,
    MatInput
  ],
  templateUrl: './location-select.component.html',
  styleUrl: './location-select.component.css'
})
export class LocationSelectComponent implements
  ControlValueAccessor,
  MatFormFieldControl<Location>,
  OnInit,
  OnDestroy {
  static nextId = 0;

  @Input() set setCompanyUID(companyUID: string | undefined) {
    if (!companyUID || companyUID === this.companyUID)
      return
    this.companyUID = companyUID;
    this._location = null;
    this.locationsControl.reset();
    this.fetchLocations();
  }
  companyUID: string | undefined;

  _location: Location | null = null;
  locationsControl = new FormControl<string | undefined>(this._location?.uid);
  locations: Array<Location> | undefined;
  locationsMap: Map<string, Location> | undefined;
  filteredLocations: Array<Location> | undefined;
  _required: boolean = false;
  stateChanges = new Subject<void>();

  focused = false;
  errorState = this.locationsControl.touched && this.locationsControl.invalid;
  controlType = 'location-select-component';
  id = `location-select-${LocationSelectComponent.nextId++}`;
  describedBy = '';
  onChange: Function = (_: any) => {
    console.debug("location select onChange")
  };
  onTouched: Function = (_: any) => {
    console.debug("location select onTouched")
  }

  @Input() allowAll: boolean | undefined;
  _formControlName = 'location';
  _placeholder: string = "locations";
  _disabled = false;

  get empty() {
    let isEmpty = true;
    if (this.locations && this.locations.length > 0) {
      isEmpty = false;
    }
    return isEmpty;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get formControlName(): string {
    return this._formControlName;
  }

  set formControlName(value: string) {
    this._formControlName = value;
    this.stateChanges.next();
  }

  @Input()
  get touched(): boolean {
    return this.locationsControl.touched;
  }

  @Input()
  get dirty(): boolean {
    return this.locationsControl.dirty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  get errors(): ValidationErrors | null {
    return this.locationsControl.errors;
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    console.debug("set as required", value)
    if (!this.locationsControl.hasValidator(Validators.required)) {
      this._required = true;
      this.locationsControl.addValidators([Validators.required])
    }
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    console.debug('location select disabled:', value);
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled)
      this.locationsControl.disable();
    else
      this.locationsControl.enable();
  }

  @Input()
  get value(): Location | null {
    if (!this._location)
      return null;
    return this._location;
  }

  set value(location: Location | null) {
    if (!location) {
      this.locationsControl.setErrors({
        notSet: true
      })
      return;
    } else {
      this.locationsControl.setErrors(null);
    }
    if (this.locationsMap)
      this.valueChange(location.uid)
    else
      this._location = location;
    this.stateChanges.next();
  }

  constructor(
    private locationsService: LocationsService,
    private formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this._disabled) {
      this.locationsControl.disable();
    }

    this.locationsControl.valueChanges.subscribe(() => {
      this.valueChange(this.locationsControl.value);
      const value = this.value;
      if (this.onChange) {
        this.onChange(value);
      }
      this.stateChanges.next();
    });

    this.locationsControl.statusChanges.subscribe( (x) => {
      console.debug("location status", x, this.locationsControl.valid)
    })

    if (!this.companyUID)
      this.fetchLocations();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: any) {

  }

  valueChange(locationUID: string | null | undefined) {
    try {
      //don't do anything if we're selecting the same id
      if (!locationUID || locationUID === this._location?.uid) {
        return;
      }
      const exists = this.locationsMap?.get(locationUID);
      if (exists)
        this._location = exists;
      else
        this._location = null;
      this.onTouched();
      this.onChange(exists);
    } catch (err) {
      console.error(err);
    }
  }

  writeValue(location: Location | null): void {
    this.value = location;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.locationsControl.disable();
    } else {
      this.locationsControl.enable();
    }
  }

  applyFilter(name: string) {
    if (!this.locations)
      return;
    const filterValue = name.toLowerCase();
    console.debug("filter ", filterValue);
    this.filteredLocations = this.locations.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  fetchLocations() {

  }
}

