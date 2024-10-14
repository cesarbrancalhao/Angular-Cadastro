import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../models/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent implements OnInit {
  constructor(
    private us: UserService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {};

  usForm!: FormGroup;
  @Output() createUser = new EventEmitter<User>();

  emRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,}){1,2}$/);
  telRegex = new RegExp(/^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{0,9}$/);
  cepRegex = new RegExp(/^\d{8}$/);
  cpfRegex = new RegExp(/^[0-9]{11}$/);
  cnpjRegex = new RegExp(/^[0-9]{14}$/);

  ngOnInit(): void {

    const path = this.route.snapshot.routeConfig?.path;

    if (path === 'edit') {
      const id = Number(localStorage.getItem('editUserId'));
      const user = this.us.getUserById(id);
      this.usForm = this.fb.group({
        id: [user.id],
        tipo: [user.tipo ? user.tipo : 'f', Validators.required],
        doc: [user.doc, Validators.required],
        nome: [user.nome, Validators.required],
        nomeF: [user.nomeF],
        cep: [user.cep, [Validators.required, this.validaCep]],
        endereco: [user.endereco, Validators.required],
        bairro: [user.bairro, Validators.required],
        cidade: [user.cidade, Validators.required],
        telefone: [user.telefone, [Validators.required, this.validaTel]],
        email: [user.email, [Validators.required, this.validaEmail]]
      });
    };

    if (path === 'add') {
      this.usForm = this.fb.group({
        id: [],
        tipo: ['f', Validators.required],
        doc: ['', Validators.required],
        nome: ['', Validators.required],
        nomeF: [''],
        cep: ['', [Validators.required, this.validaCep]],
        endereco: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        telefone: ['', [Validators.required, this.validaTel]],
        email: ['', [Validators.required, this.validaEmail]]
      });
    };

    this.updateDoc();

    this.usForm.get('tipo')?.valueChanges.subscribe(() => {
      this.updateDoc(true);
    });

    this.usForm.get('cep')?.valueChanges.subscribe(() => {
      this.updateCep();
    });
  };

  updateDoc(reset: boolean = false) {
    const tipo = this.usForm.get('tipo')?.value ?? 'f';

    if (reset) this.usForm.get('doc')?.setValue('');

    this.usForm.get('doc')?.clearValidators();
    this.usForm.get('doc')?.setValidators([Validators.required, this.validaDoc(tipo)]);
    this.usForm.updateValueAndValidity();
  };
  
  updateCep() {
    const cep = this.usForm.get('cep')?.value.toString();
    if (this.usForm.get('cep')?.valid){
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
        if (!data.erro) {
          this.usForm.patchValue({
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: `${data.localidade}/${data.uf}`
          });
        }
      });
    }
  };

  validaCep = (control: AbstractControl): { [key: string]: boolean } | null => {
    const cep = control.value.toString();
    if (cep === '' || !this.cepRegex.test(cep)) return { 'invalid': true };

    return null;
  };

  validaEmail = (control: AbstractControl): { [key: string]: boolean } | null => {
    const email = control.value.toString();
    let valid = true;
  
    if (email === '') valid = false;
    if (!this.emRegex.test(email)) valid = false;

    const exists = this.us.getall().find(user => user.email === email);
    if (exists !== undefined && this.usForm && exists.id !== this.usForm.get('id')?.value) {
      alert('Este email já existe');
      valid = false;
    };
  
    if (!valid) return { 'invalid': true };
  
    return null;
  };
  
  validaTel = (control: AbstractControl): { [key: string]: boolean } | null => {
    const tel = control.value.toString();
    let valid = true;

    if (tel === '') valid = false;
    if (!this.telRegex.test(tel)) valid = false;

    const exists = this.us.getall().find(user => user.telefone === tel);
    if (exists !== undefined && this.usForm && exists.id !== this.usForm.get('id')?.value) {
      alert('Este telefone já existe');
      valid = false;
    };

    if (!valid) return { 'invalid': true };

    return null;
  };
  
  validaDoc = (tipo: string) => {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const doc: string = control.value.toString();
      let valid = true;

      if (tipo === 'f' && (doc.length !== 11 || !this.cpfRegex.test(doc))) valid = false;
      if (tipo === 'j' && (doc.length !== 14 || !this.cnpjRegex.test(doc))) valid = false;

      const exists = this.us.getall().find(user => user.doc === doc);
      if (exists !== undefined && this.usForm && exists.id !== this.usForm.get('id')?.value) {
        alert('Este documento já existe');
        valid = false;
      };
      
      if (!valid) return { 'invalid': true };
      
      return null;
    };
  };

  isInvalid(name: string) {
    const control = this.usForm.get(name);
    return control?.invalid && control.dirty;
  };

  cancel() {
    localStorage.removeItem('editUserId');
    this.router.navigate(['']);
  };

  submit() {
    const path = this.route.snapshot.routeConfig?.path;
    const tipo = this.usForm.get('tipo')?.value ?? '';

    if (tipo === 'f') this.usForm.get('nomeF')?.setValue('-');
    
    if (this.usForm.invalid) {
      console.log(this.usForm.controls);
      alert('Há campos inválidos e/ou não preenchidos.');
      return;
    }

    if (path === 'edit') {
      this.us.update(this.usForm.value);
      this.router.navigate(['']);
      this.usForm.reset();
      return;
    }

    this.us.create(this.usForm.value);
    this.router.navigate(['']);
    this.usForm.reset();

    localStorage.removeItem('editUserId');
  };
}
