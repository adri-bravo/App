import { PolymerElement, html } from "./node_modules/@polymer/polymer/polymer-element.js";
//Declaración de variables.
var data_delete = [];
var datos = [];
var listaPedido = []; 
var timeout = null;
var categorias = [];
var unidades = {};
var g_actualiza_manual = true;

class NuevoRecuento extends PolymerElement {
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
      </style>
      <center><div id="subtitulo">Nuevo Recuento</div></center>
      
      <div>
        <vaadin-text-field id="Producto" label="Producto" on-value-changed="_preconsultar" ></vaadin-text-field>
      </div>
      <div>
        <vaadin-button id="add-button" on-click="_add" theme="icon" aria-label="Nuevo Producto"><iron-icon icon="vaadin:plus"></iron-icon></vaadin-button>
        <vaadin-button id="save-button" on-click="_guardar" theme="icon" aria-label="Guardar"><iron-icon icon="save"></iron-icon></vaadin-button>
      </div>
        <vaadin-grid theme="compact" id="grid" items="[[items]]" height-by-rows>
          <vaadin-grid-column width="60%">
            <template class="header" >
              <vaadin-text-field class="cab-Producto" value="Producto" readonly=true></vaadin-text-field>
            </template>
            <template>
              <vaadin-text-field class="col-Producto" id="Producto-[[index]]" value="[[item.Producto]]" placeholder="Producto" disabled="True" ></vaadin-text-field>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column width="40%">
            <template class="header" >
            </template>
            <template>
            <div >
              <vaadin-button id="edit-button" on-click="_resta" theme="icon" aria-label="Restar"><iron-icon icon="vaadin:minus"></iron-icon></vaadin-button>
              <vaadin-text-field theme="align-right" class="col-Uds"  id="Uds-[[index]]" value="[[item.Uds]]" placeholder="Ctd." on-value-changed="_uds_changed"></vaadin-text-field>      
              <vaadin-button on-click="_suma" theme="icon error" aria-label="Sumar"><iron-icon icon="vaadin:plus"></iron-icon></vaadin-button>
            </div>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
    }

    static get is() {
        //Nombre del recurso a utilizar desde index <clase-nueva></clase-nueva>
        return 'nuevo-recuento';
    }

    constructor() {
        super();
        //Corresponde a "properties"
        this.editing;
    }

    ready() {
      super.ready();
        //Desde aqui hacia abajo todo igual
        this.editing = null;
        var sp_load = document.getElementById("loader");
        sp_load.style.visibility = "hidden";
        //this._consultar();
        datos =[];
        listaPedido = [];
        this.$.grid.items = datos;
        this.$.grid.clearCache();
        this.editing = null;
          
      }
      _suma(e) {
        var item = e.model.item;
        var txt_ctd = this.$.grid.querySelector('#Uds-' + e.model.index);
        if (txt_ctd.value == ""){
          txt_ctd.value = "0";
        }
        var l_add = 1;

        if (item.Unidad != "ud" && item.Unidad != "cj" && item.Unidad != "pak") {
          l_add = 0.5;
        }
        txt_ctd.value = parseFloat(txt_ctd.value.replace(",", ".").trim()) + l_add;						
        txt_ctd.value = txt_ctd.value.toFixed(2).replace(".",",").replace(",00","");
        item.Uds = txt_ctd.value;
        this.$.grid.clearCache();
      }
      _resta(e) {
        var item = e.model.item;
        var txt_ctd = this.$.grid.querySelector('#Uds-' + e.model.index);
        if (txt_ctd.value == ""){
          txt_ctd.value = "0";
        }
        var l_add = 1;
        if (item.Unidad != "ud" && item.Unidad != "cj" && item.Unidad != "pak") {
          l_add = 0.5;
        }
        txt_ctd.value = parseFloat(txt_ctd.value.replace(",", ".").trim()) - l_add;						
        txt_ctd.value = txt_ctd.value.toFixed(2).replace(".",",").replace(",00","");
        item.Uds = txt_ctd.value;
        this.$.grid.clearCache();
      }
      _add(e) {
        this.$.grid.items.unshift( {Id_producto:-1,Uds:1,Producto:"",Proveedor:"",Unidad:"",Categoria:"",Importe:"0.0",Referencia:"",CodProv:""});
        this.$.grid.clearCache();
        var item = this.$.grid.items[0];
        this.editing = item;
        var cmb_categoria = this.$.grid.querySelector('#Categoria-0');
        cmb_categoria.items = categorias;
        var cmb_unidades = this.$.grid.querySelector('#Unidad-0');
        cmb_unidades.items = unidades;
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
          { alert("Formato incorrecto de Unidades en producto: " + item.Producto);
            return;
          }
          else
          { txt_ctd.value = parseFloat(txt_ctd.value.toString().replace(",",".")).toFixed(2).replace(".",",").replace(",00","");}
        }
        item.Uds = txt_ctd.value;
        this.$.grid.clearCache();
        
      }
      _preconsultar(e){
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
          var l_prod_temporal =datos[i];
          var l_encontrado = false;
          for (var j=0;j< listaPedido.length;j++){
            var l_prod_original =JSON.parse(JSON.stringify(listaPedido[j]));
            if(l_prod_temporal.Id_producto === l_prod_original.Id_producto){
              l_encontrado = true;
              if (l_prod_temporal.Uds.length != 0) {
                listaPedido[j].Uds = parseFloat(l_prod_temporal.Uds.toString().replace(",","."));
              }else{
                listaPedido[j].Uds = "";
              }
              break;
            }
          }
          if (l_encontrado === false){
            if (l_prod_temporal.Uds.length != 0) {
              l_prod_temporal.Uds = parseFloat(l_prod_temporal.Uds.toString().replace(",","."));
              listaPedido.push(l_prod_temporal);
            }
          }
        }
        
        var values = { Login:[{email: 'a',pass:'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'}],Find:[l_encodedUrl]};
        datos=[];
        var grid = this.$.grid;
        grid.items = [];

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
                for(i = 0; i<Data.Lista[1].Errores.length;i++){
                  alert(Data.Lista[1].Errores[i].Error);
                } 
              }
              catch(err){
              alert("Error al buscar productos");
              }
            }else
            {
              try{
                datos = Data.Lista[2].Datos;
                for(i = 0; i<datos.length;i++){
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
                  
                }
                
              }
              catch (err){
                alert(err);
              }
            }
            
            grid.items = datos;
            grid.clearCache();
          },
          error (jqXHR, textStatus, errorThrown) {
            sp_load.style.visibility = "hidden";
            alert("Error de conexión.Imposible obtener información"+JSON.stringify(jqXHR));
          }
        });
      }
      _guardar(e) {
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
                listaPedido[j].Uds = "";
              }
              break;
            }
          }
          if (l_encontrado === false){
            if (l_prod_temporal.Uds.length != 0) {
              l_prod_temporal.Uds = parseFloat(l_prod_temporal.Uds.toString().replace(",","."));
              listaPedido.push(l_prod_temporal);
            }
          }
        }
        var l_totalizador = "";
        var l_encontrado_um = false;
        for (var j=0;j< listaPedido.length;j++){
          l_encontrado = false;
          l_encontrado_um = false;
          if (listaPedido[j].Uds.length != 0){
            l_totalizador = "-Total("+listaPedido[j].Unidad+")";
            l_encontrado_um = false;
            for (var l=0;l < listaTotales.length;l++){
              if((listaTotales[l].Producto === l_totalizador)){
                l_encontrado_um = true;
                listaTotales[l].Uds = parseFloat(listaTotales[l].Uds) + parseFloat(listaPedido[j].Uds);
                listaTotales[l].Importe = parseFloat(listaTotales[l].Importe) + (parseFloat(listaPedido[j].Uds)*parseFloat(listaPedido[j].Importe));
                break;
              }
            }
            if (l_encontrado_um === false){
            listaTotales.push({Proveedor:"",Producto:l_totalizador,Uds:listaPedido[j].Uds,Importe:(parseFloat(listaPedido[j].Importe) * parseFloat(listaPedido[j].Uds)),Unidad:listaPedido[j].Unidad});
            }
          }
        }

        var l_totales = 0;
        var l_importe = 0;
        var l_uds = 0;
        var index = 0;
        for (var l=0;l < listaTotales.length;l++){
          index = l;
          l_importe = parseFloat(l_importe) + parseFloat(listaTotales[l].Importe);
          l_uds = parseFloat(l_uds) + parseFloat(listaTotales[l].Uds);
          l_totales = l_totales + 1;
        }
        if (l_totales == 1) {
          listaTotales[index].Producto = "-Total Recuento-";
        }
        //Formatear datos SALIDA
        var detalles = [];
        for (var i = 0; i< listaPedido.length;i++){
          var detalle = JSON.parse(JSON.stringify(listaPedido[i]));
          if (detalle.Uds.length != 0){
            detalle.Uds = parseFloat(detalle.Uds).toFixed(2).replace(".",",").replace(",00","");
            detalles.push(detalle);
          }
        }
        for (var i = 0; i < listaTotales.length;i++){
          if (listaTotales[i].Producto === "-Total Recuento-" && listaTotales[i].Uds == 0.00 && listaTotales[i].Unidad.length == 0)
          {
            listaTotales[i].Uds = "";
          }
          else
          {
            listaTotales[i].Uds = parseFloat(listaTotales[i].Uds).toFixed(2).replace(".",",").replace(",00","");
          }
        }
        var mapForm = document.createElement("form");
        mapForm.target = "_blank";    
        mapForm.method = "POST";
        var l_action ="Resumen_recuento.php";
        mapForm.action = l_action;
        // Create an input
        var mapInput = document.createElement("input");
        mapInput.type = "text";
        mapInput.name = "data";
        var values = { Login:[{email: '<?php echo $_SESSION["session_email"]; ?>',pass:'<?php echo $_SESSION["session_pass"]; ?>'}],Lista:detalles,Totales:listaTotales};
        mapInput.value = JSON.stringify(values);
        // Add the input to the form
        mapForm.appendChild(mapInput);
        // Add the form to dom
        document.body.appendChild(mapForm);
        // Just submit
        mapForm.submit();
        document.body.removeChild(mapForm);
      }
  }//fin declaración funciones

customElements.define(NuevoRecuento.is, NuevoRecuento);      