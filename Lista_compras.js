import { PolymerElement, html } from "./node_modules/@polymer/polymer/polymer-element.js";
//Declaración de variables.
var data_delete = [];
var datos = [];
var proveedores = [];
var timeout = null;
var listo = 0;

class ListaCompras extends PolymerElement {
  static get template() { 
    //Elementos HTML
    //Incluir solo estilo propio y elementos  
    return html`<style include="style-general"></style>
      <style>
      </style>
      <center><div id="subtitulo">Historial compras</div></center>
      <div>
        <vaadin-text-field id="Producto" label="Producto" on-value-changed="_preconsultar" ></vaadin-text-field>
        <vaadin-combo-box id="Proveedor" label="Proveedor" on-value-changed="_preconsultar" item-label-path="Proveedor" item-value-path="Proveedor" allow-custom-value ></vaadin-combo-box>
        <br>
        <vaadin-text-field style="width:45px;" disabled value="Desde"></vaadin-text-field> 
		    <vaadin-date-picker id="txt_fecha1" on-value-changed="_preconsultar" i18n="[[i18n_fecha]]"></vaadin-date-picker>
	      <vaadin-text-field style="width:15px;" disabled value="a"></vaadin-text-field>
		    <vaadin-date-picker id="txt_fecha2" on-value-changed="_preconsultar" i18n="[[i18n_fecha]]"></vaadin-date-picker>
	      <vaadin-button on-click="_consultar" theme="icon" aria-label="Consultar"><iron-icon icon="search"></iron-icon></vaadin-button><br>
        <vaadin-button on-click="_graficar" theme="icon" aria-label="Graficar"><iron-icon icon="vaadin:chart"></iron-icon>Gráfico</vaadin-button>
        <vaadin-checkbox id="chb_regalo" unchecked on-checked-changed="_preconsultar">Incluir Regalos</vaadin-checkbox>
      </div>
      <vaadin-grid theme="compact" id="grid" items="[[items]]" height-by-rows>
        <vaadin-grid-column resizable>
          <template class="header" >
            <vaadin-text-field  class="cab-Proveedor" value="Proveedor" readonly></vaadin-text-field>
          </template>
          <template>
            <vaadin-text-field id="Proveedor-[[index]]" value="[[item.Proveedor]]" disabled></vaadin-text-field>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable>
          <template class="header" >
            <vaadin-text-field  class="cab-Producto" value="Producto" readonly></vaadin-text-field>
          </template>
          <template>
            <vaadin-text-field  id="Producto-[[index]]" value="[[item.Producto]]" disabled></vaadin-text-field>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column width="3.5em" resizable>
          <template class="header" >
            <vaadin-text-field class="cab-Uds" theme="align-right" value="Uds" readonly></vaadin-text-field>
          </template>
          <template>
            <vaadin-text-field theme="align-right"  id="Uds-[[index]]" value="[[item.Uds]][[item.Um]]" disabled></vaadin-text-field>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column width="5em" resizable>
          <template class="header" >
            <vaadin-text-field class="cab-Importe" theme="align-right" value="Importe" readonly></vaadin-text-field>
          </template>
          <template>
            <vaadin-text-field theme="align-right" id="Importe-[[index]]" value="[[item.Importe]]€" disabled></vaadin-text-field>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>`;
    }

    static get is() {
        //Nombre del recurso a utilizar desde index <clase-nueva></clase-nueva>
        return 'lista-compras';
    }

    constructor() {
        super();
        this.i18n_fecha = {
          week: 'Mes',
          calendar: 'Calendario',
          clear: 'Eliminar',
          today: 'Hoy',
          cancel: 'Cancelar',
          firstDayOfWeek: 1,
          monthNames: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
          weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
          weekdaysShort: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
          formatDate: function (date) {
            // Format D.M.YYYY (31.12.2017)
            var fecha = new Date(0, 0); // Wrong date (1900-01-01), but with midnight in local time
    
            fecha.setFullYear(date.year);
            fecha.setMonth(date.month);
    
            if (date.day.toString().length < 2) {
              date.day = "0" + date.day;
            }
    
            date.month = date.month + 1;
    
            if (date.month.toString().length < 2) {
              date.month = "0" + date.month;
            }
    
            return [date.day, date.month, date.year].join('/');
          },
          formatTitle: function (monthName, fullYear) {
            return monthName + ' ' + fullYear;
          },
          parseDate: function (text) {
            // Parse the date with format D.M.YYYY (31.12.2017)
            var parts = text.split('/');
            var today = new Date();
            var date,
                month = today.getMonth(),
                year = today.getFullYear();
    
            if (parts.length === 3) {
              year = parseInt(parts[2]);
    
              if (parts[2].length < 3 && year >= 0) {
                year += year < 50 ? 2000 : 1900;
              }
    
              date = parseInt(parts[0]);
              month = parseInt(parts[1]) - 1;
            } else if (parts.length === 2) {
              date = parseInt(parts[0]);
              month = parseInt(parts[1]) - 1;
            } else if (parts.length === 1) {
              date = parseInt(parts[0]);
            }
    
            if (date !== undefined) {
              return {
                day: date,
                month: month,
                year: year
              };
            }
          }
        };
         // To force all event listeners for gestures to be passive.
        // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
        //setPassiveTouchGestures(true);
        }
    
      ready() {
        super.ready();
        
        this.$.txt_fecha1.value = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0];
        this.$.txt_fecha2.value = new Date().toISOString().split("T")[0];
        document.getElementById("loader").style.visibility = "hidden";
        this._iniciar();
        this.$.grid.items = datos;
        this.editing = null;
      }
      _isEditing(editing, item) {
          return item === editing;
      }
      _iniciar(){
        // - Buscar Proveedores -> Consultar
        proveedores = [];
        var self = this;
        var sp_load = document.getElementById("loader");
        sp_load.style.visibility = "visible";
        var values = {Login:[{email: 'a',pass:'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'}]};			
        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: "../../Proveedores.php",
          traditional: true,   //must be tru for arrray to be send 
          data: JSON.stringify(values),
          dataType: "json",
          success: function (Data) {
            sp_load.style.visibility = "hidden";
            if (Data.Lista[0].Resultado === "NOOK"){
              for(var i = 0; i<Data.Lista[1].Errores.length;i++){
                  alert(Data.Lista[1].Errores[i].Error);
              }
            }
            else
            {
              for(var i=0;i<Data.Lista[2].Datos.length;i++){
                  proveedores.unshift(Data.Lista[2].Datos[i].Alias);
              }
              var cmb_proveedor = self.$.Proveedor;
              cmb_proveedor.items = proveedores;
              self._consultar();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert("Error de conexión.Imposible obtener información");
            sp_load.style.visibility = "hidden";
          }
          });				
        }		
        _preconsultar(e){
          if (proveedores.length == 0){return};
          clearTimeout(timeout);
          var self = this;
          timeout = setTimeout(function () {self._consultar();}, 1000);
        }
        _consultar(e){
          this.editing = null;
          var sp_load = document.getElementById("loader");
          sp_load.style.visibility = "visible";
          this.$.grid.items = [];
          var l_where = "";
          if(this.$.txt_fecha1.value.length != 0){
            if (l_where.length == 0){
              l_where = " where ( Fecha >= '"+ this.$.txt_fecha1.value +" 00:00:00'" ;
            }
            else
            {
              l_where = l_where + " and ( Fecha >= '"+ this.$.txt_fecha1.value + " 00:00:00'" ;
            }
          }
    
          if(this.$.txt_fecha2.value.length != 0){
            if (l_where.length == 0){
              l_where = " where Fecha <= '"+ this.$.txt_fecha2.value +" 23:59:59')" ;
            }
            else
            {
              l_where = l_where + " and Fecha <= '"+ this.$.txt_fecha2.value +" 23:59:59')" ;
            }
          }
          if (this.$.chb_regalo.checked == false){
            if (l_where.length == 0){
              l_where = " where Regalo = '0" ;
            }
            else
            {
              l_where = l_where + " and Regalo = '0'" ;
            }			
          }
          if (new Date(this.$.txt_fecha1.value).getTime() < new Date(this.$.txt_fecha2.value).getTime()){
            if (this.$.Proveedor.value !== ''){
              if (l_where.length > 0){
                l_where = l_where + " and Proveedor like '%"+this.$.Proveedor.value+"%'";
              }
              else{
                l_where = " where Proveedor like '%"+this.$.Proveedor.value+"%'";
              }
            }
            if (this.$.Producto.value !== ''){
              if (l_where.length > 0){
              l_where = l_where +" and Producto like '%"+this.$.Producto.value+"%'";
              }
              else{
                l_where = " where Producto like '%"+this.$.Producto.value+"%'";
              }
            }


            var l_encodedUrl = null;
              try {
                  l_encodedUrl = encodeURI(l_where);
              } 
              catch (e) {
              }

          var values = { Login:[{email: 'a',pass:'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'}],Find:[l_encodedUrl]};
          datos=[];
          var grid = this.$.grid;
          $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "../../Listado.php",
            traditional: true,   //must be tru for arrray to be send 
            data: JSON.stringify(values),
            dataType: "json",
            success: function (Data) {
              sp_load.style.visibility = "hidden";
              if (Data.Lista[0].Resultado === "NOOK"){
                try{
                  for(var i = 0; i<Data.Lista[1].Errores.length;i++){
                    alert(Data.Lista[1].Errores[i].Error);
                  }
                }
                catch(err){
                  alert("Error al buscar compras");
                }
              }
              else
              {
                try{
                  datos = Data.Lista[2].Datos;
                  for (var i=0;i<datos.length;i++){
                    datos[i].Importe = parseFloat(datos[i].Importe).toFixed(2).replace(".",",");
                    if (datos[i].Uds.length > 0){
                      datos[i].Uds = parseFloat(datos[i].Uds).toFixed(2).replace(".",",").replace(",00","");
                    }
                  }
                }
                catch (err){
                  alert("Error al procesar datos");
                }
              }
              grid.items = datos;
              grid.clearCache();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              sp_load.style.visibility = "hidden";
              alert("Error de conexión.Imposible obtener información"+JSON.stringify(jqXHR));
            }
          });
        }
      }
      _graficar(e){
        var script = document.createElement('script');
        script.src = "Lista_compras_grafico.js";
        script.type = "module";
        script.async = false;
        document.head.appendChild(script);
        document.getElementById('contenedor').innerHTML = "<lista-compras-grafico></lista-compras-grafico>"; //$('#' + capa).innerHTML = "<lista-pedidos></lista-pedidos>";
			}
  }//fin declaración funciones

customElements.define(ListaCompras.is, ListaCompras);      