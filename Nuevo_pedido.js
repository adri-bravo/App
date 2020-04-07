import { PolymerElement, html } from "./node_modules/@polymer/polymer/polymer-element.js";
import "./Resumen_pedido.js";
//Declaración de variables.
var data_delete = [];
var datos = [];
var listaPedido = []; 
var timeout = null;
var categorias = [];
var unidades = {};
var proveedores = [];
var listo = 0;
var g_actualiza_manual = true;

class NuevoPedido extends PolymerElement {
  static get template() { 
    //Elementos HTML
    //Incluir solo estilo propio y elementos  
    return html`<style include="style-general"></style>
    <style>
        [class*="cab-"]{
            font-size:12px;
            font-weight:bold;
        }
    
        .cab-Producto {width: 60%;}
        .cab-Uds {width: 40%;}
        .col-Producto {width: 60%;}
        .col-Uds {width: 30%;}
        .divisor1{display:block}
        .divisor2{display:block}
        .divisorcab{display:block}
        @media only screen and (min-width: 768px) {
        /* For desktop: */
        .cab-Producto {width: 60%;}
        .cab-Uds {width: 40%;}
        .col-Producto {width: 60%;}
        .col-Uds {width: 10%;}
        .divisor1{display:none}
        .divisor2{display:none}
        .divisorcab{display:none}
        }
      
        /*DIALOG*/
        .cab_dialog-Proveedor {width: 30%;}
        .cab_dialog-Producto {width: 40%;}
        .cab_dialog-Importe{width: 20%;}
      
        .cab_dialog-Referencia{width: 25%;}
        .cab_dialog-Categoria{width: 35%;}
        .cab_dialog-Uds {width: 15%;}
        .cab_dialog-Unidad{width: 15%;}
        
        .cab_dialog-Uds_rapel {width: 55%;}
        .cab_dialog-Fecha_rapel {width: 35%;visibility:visible;}

        .col_dialog-Proveedor {width: 30%;}
        .col_dialog-Producto {width: 40%;}
        .col_dialog-Importe{width: 20%;}
        
        .col_dialog-Referencia{width: 25%;}
        .col_dialog-Categoria{width: 35%;}
        .col_dialog-Uds {width: 15%;}
        .col_dialog-Unidad{width: 15%;}
        
        .cab_dialog-Fecha_col{width: 15%;visibility:visible;}
        .col_dialog-Fecha_rapel {width:35%;}
        .cab_dialog-Uds_rapel_col{width: 12%;;visibility:visible;}
        .col_dialog-Uds_rapel {width: 13%;}
        .col_dialog-Porcen_rapel{width:14%}

        .divisor1_dialog{display:block}
        .divisor2_dialog{display:block}
        .divisorcab_dialog{display:block}
        @media only screen and (min-width: 768px) {
        /* For desktop: */
        .cab_dialog-Proveedor {width: 10%;}
        .cab_dialog-Producto {width: 20%;}
        .cab_dialog-Uds {width: 6%;}
        .cab_dialog-Importe{width: 7%;}
        .cab_dialog-Referencia{width: 10%;}
        .cab_dialog-Categoria{width: 15%;}
        .cab_dialog-Unidad{width: 5%;}
        .cab_dialog-Uds_rapel {width: 7%;}
        .cab_dialog-Fecha_rapel {width: 10%;visibility:visible;}
        
        .cab_dialog-Uds_rapel_col{width: 7%;display:none;}
        .cab_dialog-Fecha_col{width: 13%;display:none;}

      
        .col_dialog-Proveedor {width: 10%;}
        .col_dialog-Producto {width: 20%;}
        .col_dialog-Uds {width: 6%;}
        .col_dialog-Importe{width: 7%;}
        .col_dialog-Referencia{width: 10%;}
        .col_dialog-Categoria{width: 15%;}
        .col_dialog-Unidad{width: 5%;}
        .col_dialog-Uds_rapel{width: 7%;}
        .col_dialog-Fecha_rapel{width: 10%;}
        .col_dialog-Porcen_rapel{width: 5%;}


        .divisor1_dialog{display:none}
        .divisor2_dialog{display:none}
        .divisorcab_dialog{display:none}
        }
        /* The Modal (background) */
        .modal_add {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            padding-top: 100px; /* Location of the box */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: hidden; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }
        
        /* Modal Content */
        .modal_add-content {
            background-color: #fefefe;
            margin: auto;
            padding: 10px;
            border: 1px solid #888;
            width: 90%;
        }
        @media only screen and (min-width: 768px) {
        .modal_add-content {
            width: 90%;
        }
        }
        /* The Close Button */
        .cerrar {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }
        
        .cerrar:hover,
        .cerrar:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }	        
    }			
    </style>
    <center><div id="subtitulo">Nuevo Pedido</div></center>
    <div>
        <vaadin-text-field id="Producto" label="Producto" on-value-changed="_preconsultar" ></vaadin-text-field>
        <vaadin-combo-box id="Proveedor" label="Proveedor" on-value-changed="_preconsultar" item-label-path="Proveedor" item-value-path="Proveedor" allow-custom-value ></vaadin-combo-box>
    </div>
    <div>
        <vaadin-button id="add-button" on-click="_add" theme="icon" aria-label="Nuevo Producto"><iron-icon icon="vaadin:plus"></iron-icon></vaadin-button>
        <vaadin-button id="save-button" on-click="_guardar" theme="icon" aria-label="Guardar"><iron-icon icon="save"></iron-icon></vaadin-button>
        <vaadin-checkbox id="chb_regalo" unchecked >Regalo</vaadin-checkbox>
    </div>
    <vaadin-grid theme="compact" id="grid" items="[[items]]" height-by-rows>
        <vaadin-grid-column width="60%">
            <template class="header" >
                <vaadin-text-field class="cab-Producto" value="Producto" readonly=true></vaadin-text-field>
            </template>
            <template>
            <div on-click="_Show">
                <iron-icon  id="Icono-[[index]]" icon="[[item.Icono]]" style="fill:[[item.Color]]"></iron-icon>
                <vaadin-text-field class="col-Producto" id="Producto-[[index]]" value="[[item.Producto]]" placeholder="Producto" disabled="True" ></vaadin-text-field>
            </div>
            </template>
        </vaadin-grid-column>

        <vaadin-grid-column width="40%">
            <template class="header" ></template>
            <template>
            <div >
                <vaadin-button on-click="_resta" theme="icon" aria-label="Restar"><iron-icon icon="vaadin:minus"></iron-icon></vaadin-button>
                <vaadin-text-field theme="align-right" class="col-Uds"  id="Uds-[[index]]" value="[[item.Uds]]" placeholder="Ctd." on-value-changed="_uds_changed"></vaadin-text-field>      
                <vaadin-button on-click="_suma"  aria-label="Sumar"><iron-icon icon="vaadin:plus"></iron-icon></vaadin-button>
            </div>
            </template>
        </vaadin-grid-column>
        
    </vaadin-grid>
    <div id="loader" ></div>
    <resumen-pedido id="Resumen_pedido_id"></resumen-pedido>
    <div id="dialog_pedido" name="dialog_pedido" class="modal_add">

        <div class="modal_add-content" id="info_pedido">
            <span class="cerrar" id="cerrar" on-click="cerrar">&times;</span>
            <div style="background-color:#dc0018">
                <vaadin-text-field class="cab_dialog-Proveedor" value="Proveedor"  readonly=true></vaadin-text-field>
                <vaadin-text-field class="cab_dialog-Producto" value="Producto" readonly=true></vaadin-text-field>
                <vaadin-text-field theme="align-right" class="cab_dialog-Importe" value="€" readonly=true></vaadin-text-field>
                <div class="divisorcab_dialog"></div>
                <vaadin-text-field class="cab_dialog-Referencia" value="Referencia"  readonly=true></vaadin-text-field>
                <vaadin-text-field class="cab_dialog-Categoria" value="Categoria" readonly=true></vaadin-text-field>
                <vaadin-text-field theme="align-right" class="cab_dialog-Uds" value="Uds.Min" readonly=true></vaadin-text-field>
                <vaadin-text-field class="cab_dialog-Unidad" value="U.M."  readonly=true></vaadin-text-field>
                <div class="divisorcab_dialog"></div>
                
                <vaadin-text-field class="cab_dialog-Fecha_rapel" value="F.Rapel" readonly=true></vaadin-text-field>
                <vaadin-text-field theme="align-right" class="cab_dialog-Uds_rapel" value="Rapel" readonly=true></vaadin-text-field>
            </div>
        
            <vaadin-combo-box class="col_dialog-Proveedor" id="cmb_dialog_proveedor" placeholder="Proveedor" item-label-path="Proveedor" item-value-path="Proveedor" value="" ></vaadin-combo-box>
            <vaadin-text-field class="col_dialog-Producto" id="txt_dialog_producto" value="" placeholder="Producto"></vaadin-text-field>
            <vaadin-text-field theme="align-right" class="col_dialog-Importe"  id="txt_dialog_importe" value="" placeholder="€"></vaadin-text-field>
                            
            <div class="divisor1_dialog"></div>
            <vaadin-text-field class="col_dialog-Referencia" id="txt_dialog_referencia" value="" placeholder="Referencia"></vaadin-text-field>
            <vaadin-combo-box class="col_dialog-Categoria" id="cmb_dialog_categoria" placeholder="Categoria" item-label-path="Categoria" item-value-path="Categoria" value=""  allow-custom-value ></vaadin-combo-box>
            <vaadin-text-field theme="align-right" class="col_dialog-Uds"  id="txt_dialog_uds" value="0" placeholder="Min"></vaadin-text-field>
            <vaadin-combo-box class="col_dialog-Unidad" id="cmb_dialog_unidad" placeholder="U.Medida" item-label-path="Unidad" item-value-path="Unidad" value="" allow-custom-value ></vaadin-combo-box>
            <div class="divisor1_dialog"></div>
            
            <vaadin-text-field class="cab_dialog-Fecha_col"  disabled value="F.Rapel"></vaadin-text-field><vaadin-date-picker  class="col_dialog-Fecha_rapel" id="txt_dialog_fecha_rapel" value="" i18n="[[i18n_fecha]]" ></vaadin-date-picker>
            <vaadin-text-field class="cab_dialog-Uds_rapel_col"  disabled value="Rapel"></vaadin-text-field><vaadin-text-field theme="align-right" class="col_dialog-Uds_rapel"  id="txt_dialog_uds_rapel" value="0" placeholder="Rap" ></vaadin-text-field>
            <vaadin-checkbox class="col_dialog-Porcen_rapel" id="chb_dialog_porcen"  value="false" checked="false" >%</vaadin-checkbox>
        
        <vaadin-button id="add_producto" on-click="_add_producto" aria-label="Añadir">Añadir<iron-icon icon="vaadin:plus"></iron-icon></vaadin-button>
        </div>
    </div>
    `;
    }

    static get is() {
        //Nombre del recurso a utilizar desde index <clase-nueva></clase-nueva>
        return 'nuevo-pedido';
    }

    constructor() {
        super();
        //Corresponde a "properties"
        this.editing;
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
            formatDate (date) {
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
            formatTitle (monthName, fullYear) {
              return monthName + ' ' + fullYear;
            },
            parseDate (text) {
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
        
    }

    ready() {
        super.ready();
        //Desde aqui hacia abajo todo igual
        this.editing = null;
        var sp_load = document.getElementById("loader");
        sp_load.style.visibility = "hidden";
        this._iniciar();
        datos=[];
        listaPedido = [];
        this.$.grid.items = datos;

    }
    _iniciar(){
        // - Buscar Categorias -> Consultar
        // - Buscar Unidades -> Consultar
        // - Buscar Proveedores -> Consultar
        categorias = [];
        unidades = [];
        proveedores = [];
        var self = this;
        var sp_load = document.getElementById("loader");
        sp_load.style.visibility = "visible";

        var values = {Login:[{email: 'a',pass:'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'}]};
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "../../Categorias.php",
            traditional: true,   //must be tru for arrray to be send 
            data: JSON.stringify(values),
            dataType: "json",
            success (Data) {
                if (Data.Lista[0].Resultado === "NOOK"){
                    for(var i = 0; i<Data.Lista[1].Errores.length;i++){
                    alert(Data.Lista[1].Errores[i].Error);
                    }
                    listo = listo +1;
                }
                else
                {
                    categorias = Data.Lista[2].Datos;
                    listo = listo +1;
                                
                }
                if (listo == 3){
                    //console.log("categ");
                    sp_load.style.visibility = "hidden";
                    self._consultar();
                }
            },
            error (jqXHR, textStatus, errorThrown) {
                alert("Error de conexión.Imposible obtener información");
                listo = listo +1;
                if (listo == 3){
                    sp_load.style.visibility = "hidden";
                }
            }
        });	
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "../../Unidades.php",
            traditional: true,   //must be tru for arrray to be send 
            data: JSON.stringify(values),
            dataType: "json",
            success (Data) {
                if (Data.Lista[0].Resultado === "NOOK"){
                    for(var i = 0; i<Data.Lista[1].Errores.length;i++){
                    alert(Data.Lista[1].Errores[i].Error);
                    }
                    listo = listo +1;
                }
                else
                {
                unidades = Data.Lista[2].Datos;
                listo = listo +1;
                }
                if (listo == 3){
                    //console.log("unid");
                    sp_load.style.visibility = "hidden";
                    self._consultar();
                }

            },
            error (jqXHR, textStatus, errorThrown) {
                alert("Error de conexión.Imposible obtener información");
                listo = listo +1;
                if (listo == 3){
                    sp_load.style.visibility = "hidden";
                }
            }
        });	

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "../../Proveedores.php",
            traditional: true,   //must be tru for arrray to be send 
            data: JSON.stringify(values),
            dataType: "json",
            success (Data) {
                if (Data.Lista[0].Resultado === "NOOK"){
                    for(var i = 0; i<Data.Lista[1].Errores.length;i++){
                    alert(Data.Lista[1].Errores[i].Error);
                    }
                    listo = listo +1;
                }
                else
                {
                
                for(var i=0;i<Data.Lista[2].Datos.length;i++){
                proveedores.unshift(Data.Lista[2].Datos[i].Alias);
                    }
                var cmb_proveedor = self.$.Proveedor;
                cmb_proveedor.items = proveedores;

                listo = listo +1;
                }
                if (listo == 3){
                    //console.log("proveed");
                    sp_load.style.visibility = "hidden";
                    self._consultar();
                }

            },
            error (jqXHR, textStatus, errorThrown) {
                alert("Error de conexión.Imposible obtener información");
                listo = listo +1;
                if (listo == 3){
                    sp_load.style.visibility = "hidden";
                }
            }
        });				



        }_Show(e){
            var item = e.model.item;
            var l_texto = "Producto: " + item.Producto 
            + " \nProveedor: " + item.Proveedor
            + " \nPrecio: " + item.Importe;
            if (item.Importe != item.Importe_ant && item.Importe_ant > 0){
            l_texto = l_texto + " \nPrecio Ant: " + item.Importe_ant;
            }
            var l_precio = ((parseFloat(item.Importe) + 2.3) * 2.5);
            console.log(l_precio);
            l_texto = l_texto + "\nPrecio Botella: " + parseFloat(l_precio).toFixed(2).replace(".",",") + "€";
            l_precio = ((parseFloat(item.Importe) + 6) * 2.365) / 10;
            l_texto = l_texto + "\nPrecio Copa: " + parseFloat(l_precio).toFixed(2).replace(".",",") + "€";			
            alert(l_texto);
        }
        _suma(e) {
            g_actualiza_manual = true;
            var item = e.model.item;
            var txt_ctd = this.$.grid.querySelector('#Uds-' + e.model.index);
            if (txt_ctd.value == ""){
            txt_ctd.value = "0";
            }
            var l_add = 1;

            if (item.Unidad != "ud" && item.Unidad != "cj" && item.Unidad != "pak") {

            l_add = 0.5;
            }
            txt_ctd.value = parseFloat(txt_ctd.value.toString().replace(",", ".").trim()) + parseFloat(l_add);
            txt_ctd.value = parseFloat(txt_ctd.value).toFixed(2).replace(".",",").replace(",00","");
            item.Uds = txt_ctd.value;
            g_actualiza_manual = false;
            //this.$.grid.clearCache();		  
        }
        _resta(e) {
            g_actualiza_manual = true;
            var item = e.model.item;
            var txt_ctd = this.$.grid.querySelector('#Uds-' + e.model.index);
            if (txt_ctd.value == ""){
            txt_ctd.value = "0";
            }
            var l_add = 1;

            if (item.Unidad != "ud" && item.Unidad != "cj" && item.Unidad != "pak") {

            l_add = 0.5;
            }
            txt_ctd.value = parseFloat(txt_ctd.value.toString().replace(",", ".").trim()) - parseFloat(l_add);	
            txt_ctd.value = parseFloat(txt_ctd.value).toFixed(2).replace(".",",").replace(",00","");					
            item.Uds = txt_ctd.value;
            g_actualiza_manual = false;
            //this.$.grid.clearCache();		
        }
        _add(e) {
            this.$.dialog_pedido.style.display = "block";
            var cmb_categoria = this.$.cmb_dialog_categoria;
            cmb_categoria.items = categorias;
            var cmb_unidad = this.$.cmb_dialog_unidad;
            cmb_unidad.items = unidades;
            var cmb_proveedores = this.$.cmb_dialog_proveedor;
            cmb_proveedores.items = proveedores;
            this.$.cmb_dialog_proveedor.value = "";
            this.$.cmb_dialog_categoria.value = "";
            this.$.cmb_dialog_unidad.value = "";						

        }
        cerrar() {
            this.$.dialog_pedido.style.display = "none";
        }
        _add_producto(e) {
            if (this.$.txt_dialog_importe.value.length > 0)
            {
            }else {this.$.txt_dialog_importe.value = "0.0";}

            if (this.$.txt_dialog_uds.value.length > 0)
            {
            }else {this.$.txt_dialog_uds.value = 0;}
            if (this.$.txt_dialog_uds_rapel.value.length > 0)
            {
            }else {this.$.txt_uds_rapel.value = 0;}
                                
            var productos_guardar = [];
            var productos_borrar = [];
            if(this.$.cmb_dialog_proveedor.value.length != 0 && this.$.txt_dialog_producto.value.length != 0){
                
                var d = new Date();
                var month = '' + (d.getMonth() + 1);
                var day = '' + d.getDate();
                var year = d.getFullYear();
                var hour = d.getHours();
                var minutes = d.getMinutes();
                var seconds = d.getSeconds();	
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                if (hour.length < 2) hour = '0' + hour;
                if (minutes.length < 2) minutes = '0' + minutes;
                if (seconds.length < 2) seconds = '0' + seconds;
                var l_dialog_fecha_precio = year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
                
                productos_guardar.push({Id_Producto:-1,
                    Proveedor:this.$.cmb_dialog_proveedor.value,
                    Nombre:this.$.txt_dialog_producto.value,
                    Uds:this.$.txt_dialog_uds.value,
                    Fecha_rapel:this.$.txt_dialog_fecha_rapel.value,
                    Uds_rapel:this.$.txt_dialog_uds_rapel.value,
                    Importe_ant:0,
                    Importe:this.$.txt_dialog_importe.value,
                    Um:this.$.cmb_dialog_unidad.value,
                    Categoria:this.$.cmb_dialog_categoria.value,
                    Referencia:this.$.txt_dialog_referencia.value,
                    CodProv:"",
                    Fecha_precio:l_dialog_fecha_precio,
                    Porcen:this.$.chb_dialog_porcen.checked})
            }else
            {
                alert("Faltan datos obligatorios.");
                return;
            }
            var sp_load = document.getElementById("loader");
            sp_load.style.visibility = "visible";
            var values = { Login:[{email: 'a',pass:'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'}],Borrar:productos_borrar,Guardar:productos_guardar};
            var self = this;
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "../../Guardar_producto.php",
                traditional: true,   //must be tru for arrray to be send 
                data: JSON.stringify(values),
                dataType: "json",
                success (Data) {
                    sp_load.style.visibility = "hidden";
                        // here comes your response after calling the server
                        if (Data.Lista[0].Resultado === "NOOK"){
                            for(var i = 0; i<Data.Lista[1].Errores.length;i++){
                            alert(Data.Lista[1].Errores[i].Error);
                            }
                        }else{
                            alert("Datos guardados correctamente.");
                            self.$.dialog_pedido.style.display = "none";
                            self._consultar();
                            }
                },
                error (jqXHR, textStatus, errorThrown) {
                    sp_load.style.visibility = "hidden";
                    alert("Error de conexión.No se han guardado los datos");
                }
            });			 
        }
        _uds_changed(e){
            try{
            var item = e.model.item;
            var txt_ctd = this.$.grid.querySelector('#Uds-' + e.model.index);
            item.Uds = txt_ctd.value;

            clearTimeout(timeout);
            var self = this;
            timeout = setTimeout(function () {self._formatear_uds(e);}, 1000);
            }catch {}
        }
        _formatear_uds(e){
            if (g_actualiza_manual == false){g_actualiza_manual = true;return;}
            var item = e.model.item;
            var txt_ctd = this.$.grid.querySelector('#Uds-' + e.model.index);

            //Formatear para tratamiento interno (FLOAT) 
            txt_ctd.value = txt_ctd.value.toString().trim(); 
            if(txt_ctd.value.toString().trim().length > 0){
                if (Number.isNaN(Number(txt_ctd.value.toString().replace(",","."))))
                {alert("Formato incorrecto de Unidades en producto: " + item.Producto);
                return;}
                else
                {txt_ctd.value = parseFloat(txt_ctd.value.toString().replace(",",".")).toFixed(2).replace(".",",").replace(",00","");}
            }
            item.Uds = txt_ctd.value;

        }
        _preconsultar(e){
            if (proveedores.length == 0){return};
            clearTimeout(timeout);
            var self = this;
            timeout = setTimeout(function () {self._consultar();}, 1000);
        }
        _consultar(e) {
            this.editing = null;
            var sp_load = document.getElementById("loader");
            sp_load.style.visibility = "visible";
            if ( data_delete.length >0){
                alert("OJO hay " + data_delete.length + " productos pendientes de borrar");
            }
            var l_where = "";
            if (this.$.Proveedor.value !== ''){
                l_where = " where Proveedor like '%"+this.$.Proveedor.value+"%'";
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
            for (var i=0;i< datos.length;i++){
                var l_prod_temporal =JSON.parse(JSON.stringify(datos[i]));
                var l_encontrado = false;
                for (var j=0;j< listaPedido.length;j++){
                    var l_prod_original =listaPedido[j];
                    if(l_prod_temporal.Id_producto === l_prod_original.Id_producto){
                        l_encontrado = true;
                        if (l_prod_temporal.Uds.length != 0) {
                        listaPedido[j].Uds = parseFloat(l_prod_temporal.Uds.toString().replace(",","."));
                        }
                    break;
                    }

                }
                if (l_encontrado === false){
                    if (l_prod_temporal.Uds.length != 0) {
                        l_prod_temporal.Importe = parseFloat(l_prod_temporal.Importe.replace(",","."));
                        listaPedido.push(l_prod_temporal);
                    }
                }

            }
            var grid = this.$.grid;
            grid.items = [];
            var values = { Login:[{email: 'a',pass:'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'}],Find:[l_encodedUrl]};
            datos=[];
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "../../Stock.php",
                traditional: true,   //must be tru for arrray to be send 
                data: JSON.stringify(values),
                dataType: "json",
                success (Data) {
                sp_load.style.visibility = "hidden";
                    if (Data.Lista[0].Resultado === "NOOK"){
                        try{
                            for(var i = 0; i<Data.Lista[1].Errores.length;i++){
                                console.log("sindatos");
                                alert(Data.Lista[1].Errores[i].Error);
                            }
                        }
                        catch(err){
                            alert("Error al obtener productos");
                        }
                    }else
                    {

                        try{
                            datos = Data.Lista[2].Datos;
                            var l_icon = "";	
                            var l_color = "";
                            var Hoy = new Date();
                            var comparar = new Date();
                            Hoy.setDate(comparar.getDate() - 60);

                            for(var i = 0; i<datos.length;i++){
                                var prod = null;				
                                var l_encontrado = false;								
                                //Buscar si el producto ya ha sido añadido y actualizar unidades pedidas
                                for (var j = 0; j < listaPedido.length; j++) {
                                    var l_prod_original = listaPedido[j];
                                    if (datos[i].Id_producto === l_prod_original.Id_producto) {
                                        datos[i].Uds = l_prod_original.Uds;
                                        l_encontrado = true;
                                        break;
                                    }
                                }
                                if (l_encontrado === false) {
                                    datos[i].Uds = "";
                                
                                }

                                comparar = new Date();
                                datos[i].Icono = "";
                                datos[i].Color = "";
                                if (datos[i].Fecha_precio !== "0000-00-00 00:00:00"){
                                    comparar = new Date(datos[i].Fecha_precio.replace(" ","T"));;
                                    if (comparar > Hoy){
                                        if (datos[i].Diff == datos[i].Importe){
                                            l_icon = "grade";
                                            l_color = "yellow";	
                                        }
                                        else if (datos[i].Diff == 0){
                                            l_icon = "";
                                            l_color = "";
                                            
                                        }
                                        else if (datos[i].Diff > 0){
                                            l_icon = "arrow-drop-up";
                                            l_color = "red";
                                        }
                                        else if (datos[i].Diff < 0){
                                            l_icon = "arrow-drop-down";
                                            l_color = "green";
                                        }
                                    datos[i].Icono = l_icon;
                                    datos[i].Color = l_color;	
                                    }
                                }

                            }
                            
                        }
                        catch (err){
                            alert("Error: " + err);
                            }
                    }
                    grid.items = datos;
                },
                error (jqXHR, textStatus, errorThrown) {
                    sp_load.style.visibility = "hidden";
                    alert("Error de conexión.Imposible obtener información"+JSON.stringify(jqXHR));
                }
            });

        }
        _guardar(e) {
            var listaProveedores = [];
            var listaTotales = [];
            var l_encontrado = false;
            for (var i=0;i< datos.length;i++){
                var l_prod_temporal =JSON.parse(JSON.stringify(datos[i]));
                l_encontrado = false;
                for (var j=0;j< listaPedido.length;j++){

                    var l_prod_original =listaPedido[j];
                    if(l_prod_temporal.Id_producto === l_prod_original.Id_producto){
                
                        l_encontrado = true;
                        if (l_prod_temporal.Uds.length != 0) {
                            listaPedido[j].Uds = parseFloat(l_prod_temporal.Uds.toString().replace(",","."));
                        }else{
                        listaPedido[j].Uds = 0.00;
                        }
                    break;
                    }
                }
                if (l_encontrado === false){
                    if (l_prod_temporal.Uds.length != 0 && l_prod_temporal.Uds != 0) {
                        l_prod_temporal.Uds = parseFloat(l_prod_temporal.Uds.toString().replace(",","."));
                        l_prod_temporal.Importe = parseFloat(l_prod_temporal.Importe.replace(",","."));
                        listaPedido.push(l_prod_temporal);
                    }
                }
            }
            var l_totalizador = "";
            var l_encontrado_um = false;
            for (var j=0;j< listaPedido.length;j++){
                l_encontrado = false;
                l_encontrado_um = false;
                if (listaPedido[j].Uds != 0 && listaPedido[j].Uds.toString().trim().length != 0){
                    l_totalizador = "-Total("+listaPedido[j].Unidad+")";
                    for (var p=0;p < listaProveedores.length;p++){
                    
                        if(listaPedido[j].Proveedor === listaProveedores[p].Proveedor){
                            l_encontrado = true;
                            listaProveedores[p].Importe = listaProveedores[p].Importe + (parseFloat(listaPedido[j].Importe) * parseFloat(listaPedido[j].Uds));
                            if (this.$.chb_regalo.checked == true){
                                listaProveedores[p].Importe = 0;
                            }
                            l_encontrado_um = false;
                            for (var l=0;l < listaTotales.length;l++){
                                if((listaPedido[j].Proveedor === listaTotales[l].Proveedor) && (listaTotales[l].Producto === l_totalizador)){
                                    l_encontrado_um = true;
                                    listaTotales[l].Uds = parseFloat(listaTotales[l].Uds) + parseFloat(listaPedido[j].Uds);
                                    listaTotales[l].Importe = parseFloat(listaTotales[l].Importe) + (parseFloat(listaPedido[j].Uds)*parseFloat(listaPedido[j].Importe));
                                    if (this.$.chb_regalo.checked == true){
                                        listaTotales[l].Importe = 0.0;
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    var l_importe_prov = parseFloat(listaPedido[j].Importe) * parseFloat(listaPedido[j].Uds);

                    if (l_encontrado === false){
                        if (this.$.chb_regalo.checked == true){
                            l_importe_prov = 0.0;
                        }
                    listaProveedores.push({Proveedor:listaPedido[j].Proveedor,Importe:l_importe_prov});
                    }
                    if (l_encontrado_um === false){
                        if (this.$.chb_regalo.checked == true){
                            l_importe_prov = 0.0;
                        }

                        listaTotales.push({Proveedor:listaPedido[j].Proveedor,Producto:l_totalizador,Uds:listaPedido[j].Uds,Importe:l_importe_prov,Unidad:listaPedido[j].Unidad});
                
                    }
                }

            }

            for (var p=0;p < listaProveedores.length;p++){
                var l_totales = 0;

                var l_importe = 0;
                var l_uds = 0;
                var index = 0;
                for (var l=0;l < listaTotales.length;l++){
                    if(listaProveedores[p].Proveedor === listaTotales[l].Proveedor){
                        index = l;
                        l_importe = parseFloat(l_importe) + parseFloat(listaTotales[l].Importe);
                        l_uds = parseFloat(l_uds) + parseFloat(listaTotales[l].Uds);
                        l_totales = l_totales + 1;
                    }
                }
                if (l_totales == 1) {
                    listaTotales[index].Producto = "-Total Factura-";
                    //listaTotales[index].Uds = l_uds;
                }
                else
                {
                    listaTotales.push({Proveedor:listaProveedores[p].Proveedor,Producto:"-Total Factura-",Uds:0.00,Importe:l_importe,Unidad:""});
                }

            }
            //Formatear datos SALIDA
            var detalles = [];
            for (var i = 0; i< listaPedido.length;i++){
                var detalle = JSON.parse(JSON.stringify(listaPedido[i]));
                if (detalle.Uds.length != 0 && detalle.Uds != 0){
                    detalle.Importe_total = parseFloat(detalle.Uds * detalle.Importe).toFixed(2).replace(".",",");
                    if (this.$.chb_regalo.checked == true){
                        detalle.Importe_total = parseFloat(0.0).toFixed(2).replace(".",",");
                    }
                    detalle.Uds = parseFloat(detalle.Uds).toFixed(2).replace(".",",").replace(",00","");
                    detalle.Importe = parseFloat(detalle.Importe).toFixed(2).replace(".",",");
                    if (this.$.chb_regalo.checked == true){
                        detalle.Importe = parseFloat(0.0).toFixed(2).replace(".",",");
                    }

                    detalles.push(detalle);
                }
            }
            for (var i = 0; i < listaTotales.length;i++){
                if (listaTotales[i].Producto === "-Total Factura-" && listaTotales[i].Uds == 0.00 && listaTotales[i].Unidad.length == 0)
                {
                    listaTotales[i].Uds = "";
                }
                else
                {
                    listaTotales[i].Uds = parseFloat(listaTotales[i].Uds).toFixed(2).replace(".",",").replace(",00","");
                }
                listaTotales[i].Importe = parseFloat(listaTotales[i].Importe).toFixed(2).replace(".",",");
            }
            for (var i = 0; i < listaProveedores.length;i++){
                listaProveedores[i].Importe = parseFloat(listaProveedores[i].Importe).toFixed(2).replace(".",",");
            }
            
            if (detalles.length == 0){
                alert("No ha seleccionado ningún producto");
            }
            else
            {
                var l_regalo = this.$.chb_regalo.checked;
                var values = { Login:[{email: '<?php echo $_SESSION["session_email"]; ?>',pass:'<?php echo $_SESSION["session_pass"]; ?>'}],Lista:detalles,Proveedores:listaProveedores,Totales:listaTotales,Regalo:l_regalo};
                localStorage.setItem("datos",JSON.stringify(values));
                this.$.Resumen_pedido_id.control_titulos();
                this.$.Resumen_pedido_id.load_pagina();
                this.$.Resumen_pedido_id.open();
            }
            /*var mapForm = document.createElement("form");
            mapForm.target = "_blank";    
            mapForm.method = "POST";
            var l_action ="Resumen_pedido.php";
            mapForm.action = l_action;
            // Create an input
            var mapInput = document.createElement("input");
            mapInput.type = "text";
            mapInput.name = "data";
            var values = { Login:[{email: '<?php echo $_SESSION["session_email"]; ?>',pass:'<?php echo $_SESSION["session_pass"]; ?>'}],Lista:detalles,Proveedores:listaProveedores,Totales:listaTotales,Regalo:l_regalo};
            
            mapInput.value = JSON.stringify(values);
            // Add the input to the form
            mapForm.appendChild(mapInput);
            // Add the form to dom
            document.body.appendChild(mapForm);
            // Just submit
            mapForm.submit();
            document.body.removeChild(mapForm);*/

            /*var values = { Login:[{email: '<?php echo $_SESSION["session_email"]; ?>',pass:'<?php echo $_SESSION["session_pass"]; ?>'}],Lista:detalles,Proveedores:listaProveedores,Totales:listaTotales,Regalo:l_regalo};
            localStorage.setItem("datos",JSON.stringify(values));
            var win = window.open('./Resumen_pedido.html', '_blank');
            // Cambiar el foco al nuevo tab (punto opcional)
            win.focus();
            */
           /*var script = document.createElement('script');
  script.src = "./Resumen_pedido.js";
  script.type = "module";
  
  script.async = false;
  document.head.appendChild(script);
  this.$.dialog_contenedor.innerHTML = "<resumen-pedido></resumen-pedido>";
  this.$.dialog_contenedor.style.display = "block";*/


        }//fin declaración funciones

}
customElements.define(NuevoPedido.is, NuevoPedido);      