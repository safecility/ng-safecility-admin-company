import { Component } from '@angular/core';
import { CompanyAddComponent } from "../company-add/company-add.component";
import { MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { MatButton } from "@angular/material/button";
import { EditorService } from "safecility-admin-services";
import { CompanyEmit, CompanyService, NewCompany } from "../../company.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'lib-company-add-editor',
  standalone: true,
  imports: [
    CompanyAddComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './company-add-editor.component.html',
  styleUrl: './company-add-editor.component.css'
})
export class CompanyAddEditorComponent {

  data: NewCompany | undefined;
  valid: boolean = false;

  constructor(
    private editorService: EditorService,
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
  ) {
  }

  companyEdited(c: CompanyEmit | undefined) {
    this.data = c?.company;
    this.valid = !!c?.valid;
  }

  cancel() {
    this.editorService.closeEditor()
  }

  addCompany() {
    if (this.data)
      this.companyService.addCompany(this.data).subscribe({
        next: value => {
          this.snackBar.open("added company", "", {duration: 3000})
          this.editorService.closeEditor()
        }
      })
  }
}
