import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacturacionService {
  //
  urlServices: any = environment.URL;

  constructor(private httpClient: HttpClient) {}

  obtenerProductos() {
    return this.httpClient.get<any>(`${this.urlServices}/obtenerProductos`);
  }

  obtenerFacturas() {
    return this.httpClient.get<any>(`${this.urlServices}/obtenerFacturas`);
  }

  obtenerFactura(id: any) {
    let params = new HttpParams().set('idFactura', id);

    return this.httpClient.get<any>(`${this.urlServices}/obtenerFactura`, {
      params,
    });
  }

  procesarFactura(factura: any) {
    return this.httpClient.post<any>(
      `${this.urlServices}/procesarFactura`,
      factura
    );
  }

  eliminatFactura(id: any) {
    let params = new HttpParams().set('idFactura', id);

    return this.httpClient.delete<any>(`${this.urlServices}/eliminarFactura`, {
      params,
    });
  }
}
