import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs/operators';
import { FacturacionService } from 'src/app/_services/facturacion.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css'],
})
export class FacturacionComponent implements OnInit {
  //
  constructor(
    private messageService: MessageService,
    private facturacionServices: FacturacionService
  ) {}

  facturas: any = [];

  ngOnInit(): void {
    this.consultarFacturas();
  }

  consultarFacturas() {
    this.facturacionServices.obtenerFacturas().subscribe((data) => {
      this.facturas = data.data;
    });
  }

  eliminarFactura(id: number) {
    this.facturacionServices
      .eliminatFactura(id)
      .pipe(
        switchMap((data) => {
          this.showInfo(data.msg);
          return this.facturacionServices.obtenerFacturas();
        })
      )
      .subscribe((data) => {
        this.facturas = data.data;
      });
  }

  showInfo(msg: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Éxito',
      detail: msg,
    });
  }
}
