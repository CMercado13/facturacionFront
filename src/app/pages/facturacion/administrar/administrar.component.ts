import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs/operators';
import { Detalle } from 'src/app/_model/Detalle';
import { FacturacionService } from 'src/app/_services/facturacion.service';
import { FacturacionComponent } from '../facturacion.component';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.component.html',
  styleUrls: ['./administrar.component.css'],
})
export class AdministrarComponent implements OnInit {
  //
  //

  @ViewChild('btnProcesar')
  btnProcesar!: ElementRef;
  //
  form: FormGroup;
  id: number = 0;
  edicion: boolean = false;
  view: boolean = false;
  tiposPago: any = [
    { name: 'Crédito', value: 'CREDITO' },
    { name: 'Contado', value: 'CONTADO' },
  ];
  productos: any = [];
  detalles: any = [];
  producto: any;
  precio: any;
  detallesDTO: Detalle[] = [];
  detalleDTO: Detalle = new Detalle();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private facturacionServices: FacturacionService,
    private messageService: MessageService,
    private facturaApp: FacturacionComponent
  ) {
    this.form = this.fb.group({
      id: [null],
      fecha: [null, [Validators.required]],
      tipo_pago: ['', [Validators.required]],
      dni_cliente: [null, [Validators.required, Validators.minLength(2)]],
      nombre_cliente: [null, [Validators.required, Validators.minLength(2)]],
      descuento: [null, [Validators.min(0)]],
      total: [null],
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.id = params['id'];
          return this.facturacionServices.obtenerProductos();
        }),
        switchMap(({ data }) => {
          this.productos = data;
          return this.facturacionServices.obtenerFactura(this.id);
        })
      )
      .subscribe(({ data }) => {
        let factura: any = data[0];
        this.form.setValue({
          id: factura.id,
          fecha: new Date(factura.fecha),
          tipo_pago: factura.tipo_pago,
          dni_cliente: factura.dni_cliente,
          nombre_cliente: factura.nombre_cliente,
          descuento: factura.descuento,
          total: factura.total,
        });
        this.detallesDTO = factura.detalles;
        this.view = true;
      });
    this.view = true;
  }

  procesar() {
    if (!this.form.valid) {
      return;
    }
    let factura = this.form.value;
    factura.detalles = this.detallesDTO;
    factura.fecha = factura.fecha.getTime();
    this.facturacionServices.procesarFactura(factura).subscribe((data) => {
      this.showInfo(data.msg);
      this.onClose();
      this.facturaApp.consultarFacturas();
    });
  }

  agregarProducto() {
    this.detallesDTO.push(this.detalleDTO);
    this.detalleDTO = new Detalle();
  }

  /**
   * Método que realiza el envío de los datos
   * del formulario.
   */
  isSubmit() {
    if (this.form.valid) {
      this.btnProcesar.nativeElement.click();
    }
  }

  onClose() {
    let url = this.router.url;
    this.route.parent?.url.subscribe((data) => {
      let y = '';
      data.forEach((x) => {
        y += x.path + '/';
      });
      let r = this.router.url.substring(0, url.lastIndexOf(y));
      url = r + y;
      this.view = false;
      this.router.navigate([url]);
    });
  }

  showInfo(msg: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Mensaje',
      detail: msg,
    });
  }
}
