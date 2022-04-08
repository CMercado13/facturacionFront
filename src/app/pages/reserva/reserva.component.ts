import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css'],
})
export class ReservaComponent implements OnInit {
  //
  //
  @ViewChild('btnProcesar')
  btnProcesar!: ElementRef;
  //
  barrios: any = [];
  barriosHasta: any;
  form!: FormGroup;
  //
  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  //
  ngOnInit() {
    this.httpClient
      .get('assets/_json/barriosCartagena.json')
      .subscribe((data) => {
        this.barrios = data;
        this.nuevoForm();
      });
  }

  selectBarrio(event: any) {
    this.barriosHasta = [];
    this.barrios.forEach((b: any) => {
      if (b.idBarrio != event.value.idBarrio) {
        this.barriosHasta.push(b);
      }
    });
  }

  selectBarrioHasta() {
    this.form.controls.valor.setValue(Math.floor(Math.random() * 15884));
    console.log(this.form.controls.valor.value);
  }

  nuevoForm() {
    this.form = new FormGroup({
      id: new FormControl(0),
      nombre: new FormControl(null, [Validators.required]),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      direccion: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null, [Validators.required]),
      desde: new FormControl(null, [Validators.required]),
      hasta: new FormControl(null, [Validators.required]),
      valor: new FormControl(null, [Validators.required]),
    });
  }

  procesar() {
    console.log('form', this.form.value);
    this.nuevoForm();
    this.showInfo();
  }

  isSubmit() {
    if (this.form.valid) {
      this.btnProcesar.nativeElement.click();
    }
  }

  showInfo() {
    this.messageService.add({
      severity: 'info',
      summary: 'Éxito',
      detail: 'Reserva Registrada Con Éxito',
    });
  }
}
