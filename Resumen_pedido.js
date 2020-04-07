import { PolymerElement, html } from "./node_modules/@polymer/polymer/polymer-element.js";
//Declaración de variables.

class ResumenPedido extends PolymerElement {
  static get properties(){
      return {
          opened: {
              type:Boolean,
              value: false
          },
          modalclass:{
              type: String,
              computed: 'get_modal(opened)'
          }
      }
  }  
  static get template() { 
    //Elementos HTML
    //Incluir solo estilo propio y elementos  
    return html`<style include="style-general"></style>
      <style>
        vaadin-text-field {
            width: 100%;
        }
        #centro{
          margin: 0 auto;
          width: 100%;
        }
        #botones{
          margin: 0 auto;
          width: 50%;
        }
        #tabla_resumen {
          border-collapse: collapse;
          width:100%}
        #tabla_resumen td {
          border-bottom:1pt solid #CCC;
        }
        #tabla_resumen th{
          text-align:left;
        }	
        #tabla_resumen .euro{
            text-align:right;
        }	
        @media only screen and (min-width: 768px) {
            #centro{
                width: 30%;
            }
            #tabla_resumen {
                width:100%
            }
        }
        /* The Modal (background) */
        .modal {
            display: block; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            padding-top: 50px; /* Location of the box */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
            
            
        }
        .modal-dialog{
            overflow-y: initial !important;
            height:60%;
        }
        
        /* Modal Content */
        .modal-content {
            background-color: #fefefe;
            margin: auto;
            padding: 10px;
            border: 1px solid #888;
            width: 90%;
            height:100%;
            overflow-y: auto;
        }
        @media only screen and (min-width: 768px) {
        .modal-content {
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
        .closed{
            display:none
        }
        </style>
        <div id="dialog_contenedor" name="dialog_contenedor" class$=[[modalclass]]>
            <div class="modal-dialog">
                <div class="modal-content" id="resumen_pedido">
                    <div id="contenedor" style="position:relative;">
                        <center><div id="subtitulo">Nuevo Pedido</div></center>
                        <div id="centro">
                    </div>
                    <div id='botones'>
                        <center><vaadin-button id='cancel-button' on-click='close' theme='icon' aria-label='Cancelar'><iron-icon icon='cancel'></iron-icon>Cancelar</vaadin-button>
                                <vaadin-button id='save-button' on-click='guardar' theme='icon' aria-label='Guardar'><iron-icon icon='save'></iron-icon>Guardar</vaadin-button>
                        </center>
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    static get is() {
        //Nombre del recurso a utilizar desde index <clase-nueva></clase-nueva>
        return 'resumen-pedido';
    }

    constructor() {
        super();
        //Corresponde a "properties"
        this.editing;
    }

    ready() {
        super.ready();
            //Desde aqui hacia abajo todo igual
        // this.control_titulos();
        // this.load_pagina();
        }
        control_titulos(){
            var obj = JSON.parse(localStorage.getItem("datos")) ;
            if (obj['Regalo'] == true){
                
                this.$.subtitulo.innerHTML = "Nuevo Pedido Regalo";
            }
        
    }
      
    load_pagina(){
        var i = 0;
        var total_general = 0;
        var obj = JSON.parse(localStorage.getItem("datos"));
        var capa = this.$.centro;      
        capa.innerHTML ="";
        for(var prov = 0;prov < obj['Proveedores'].length;prov++){
            var proveedor = obj['Proveedores'][prov];
            if(i > 0){
                var br = document.createElement("div");
                br.innerHTML="</br>";
                capa.appendChild(br);
            }
            var d = new Date();
            var month = '' + (d.getMonth() + 1).toString();
            var day = '' + d.getDate().toString();
            var year = d.getFullYear().toString();
            var hour = d.getHours().toString();
            var minutes = d.getMinutes().toString();
            var seconds = d.getSeconds().toString();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            if (hour.length < 2) hour = '0' + hour;
            if (minutes.length < 2) minutes = '0' + minutes;
            if (seconds.length < 2) seconds = '0' + seconds;
            var l_fecha = day+"-"+month+"-"+year+" "+hour+":"+minutes+":"+seconds
            
            var tabla = document.createElement("div");
            var l_texto;
            l_texto = "<table><tr><td><img src='images/list.png'/></td><td>Proveedor: " + proveedor.Proveedor + "</br>Fecha: " + l_fecha + "</br>Importe: " + proveedor.Importe + "&euro;</td></tr></table>";
            l_texto += "<vaadin-text-field name='txt_notas_"+ proveedor.Proveedor +"' label='Notas'></vaadin-text-field>";
            tabla.innerHTML = l_texto;
            capa.appendChild(tabla);
            
            var tabla_resumen = document.createElement("div");
            var l_texto;
            l_texto = "<table id='tabla_resumen'><th>Producto</th><th>Ctd.</th><th class='euro'>&euro;</th>";
                
                for(var ped = 0;ped < obj['Lista'].length;ped++){
                var pedido = obj['Lista'][ped];
                if (proveedor.Proveedor == pedido.Proveedor)
                {
                    total_general = total_general + parseFloat(pedido.Importe_total.replace(",","."));
                    l_texto += "<tr><td>"+pedido.Producto+"</td><td>"+ pedido.Uds + pedido.Unidad + "</td><td align='right'>" + pedido.Importe_total + "&euro;</td></tr>";
                }
    
            }
            for(var total_index = 0;total_index < obj['Totales'].length;total_index++){
                var total = obj['Totales'][total_index];
                if (proveedor.Proveedor == total.Proveedor ){
                l_texto +=  "<tr><td>" + total.Producto + "</td><td>"+ total.Uds + total.Unidad + "</td><td align='right'>"+ total.Importe+"&euro;</td></tr>";
                }
            }
            
    
            l_texto += "</table>";
            tabla_resumen.innerHTML = l_texto;
            capa.appendChild(tabla_resumen);
    
            i = i + 1;
    
        
        }
        var final = document.createElement("div");
        var l_texto;
        l_texto = "</br><b>Total Pedidos: "+ total_general.toString().replace(".",",")+ "€</b>";
        l_texto += "</br>";
        final.innerHTML = l_texto;
        capa.appendChild(final);
    
    }
        
    guardar() {
        var self = this;
        var capa = this.$.centro;
        var sp_load = document.getElementById("loader");
        sp_load.style.visibility = "visible";
        var obj = JSON.parse(localStorage.getItem("datos")) ;
        var lista_pedidos_agrup = [];
        var lista_productos = [];
        lista_pedidos_agrup = obj['Proveedores'];
        lista_productos = obj['Lista'];
        var cabeceras = [];
        var detalles = [];
        var l_regalo = obj['Regalo'];
        var d = new Date();
        var month = '' + (d.getMonth() + 1).toString();
        var day = '' + d.getDate().toString();
        var year = d.getFullYear().toString();
        var hour = d.getHours().toString();
        var minutes = d.getMinutes().toString();
        var seconds = d.getSeconds().toString();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if (minutes.length < 2) minutes = '0' + minutes;
        if (seconds.length < 2) seconds = '0' + seconds;
        var l_fecha = year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds	
        for (var i = 0; i < lista_pedidos_agrup.length; i++) {
            //OJO a la forma en como se coge el dato.Es añadido en innerHTML y no se tiene acceso normal al elemento.    
            var l_notas = capa.querySelectorAll("[name=txt_notas_"+lista_pedidos_agrup[i].Proveedor+"]")[0].value;
            cabeceras.push({Id_Pedido:-1,
                Proveedor:lista_pedidos_agrup[i].Proveedor,
                Importe:lista_pedidos_agrup[i].Importe.replace(",","."),
                Fecha_prevista:"01-01-1900 00:00",
                Fecha:l_fecha,
                Notas: l_notas,
                Regalo: l_regalo})
        }
        for (var i=0;i<lista_productos.length;i++){
        detalles.push({Proveedor:lista_productos[i].Proveedor,
                Producto:lista_productos[i].Producto,
                Uds:parseFloat(lista_productos[i].Uds.replace(",",".")),
                Importe:parseFloat(lista_productos[i].Importe.replace(",","."))*parseFloat(lista_productos[i].Uds.replace(",",".")),
                Um:lista_productos[i].Unidad,
                Referencia:lista_productos[i].Referencia});
        }
        var values = { Login:[{email: 'a',pass:'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'}],Cabeceras:cabeceras,Detalles:detalles};
        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: "../../Guardar_pedidos.php",
          traditional: true,   //must be tru for arrray to be send 
          data: JSON.stringify(values),
          dataType: "json",
          success: function (Data) {
            sp_load.style.visibility = "hidden";
              // here comes your response after calling the server
            if (Data.Lista[0].Resultado === "NOOK"){
                for(var i = 0; i<Data.Lista[1].Errores.length;i++){
                    alert(Data.Lista[1].Errores[i].Error);
                }
            }else
            {
                alert("Datos guardados correctamente.");
                localStorage.removeItem("datos");
                self.close();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            sp_load.style.visibility = "hidden";
            alert("Error de conexión.No se han guardado los datos");
          }
        });			 

      }
      get_modal(opened)
      {
        if(opened){
            return 'modal';
        }  
        return 'closed';
      }
      open(){
          this.opened = true;
      }
      close(){
          
        this.opened = false;
    }
        
  }//fin declaración funciones

customElements.define(ResumenPedido.is, ResumenPedido);      