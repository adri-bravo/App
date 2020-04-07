import { PolymerElement, html } from "./node_modules/@polymer/polymer/polymer-element.js";
//Declaración de variables.
var datos = [];
var timeout = null;

class ListadoRecuentos extends PolymerElement {
  static get template() { 
    //Elementos HTML
    //Incluir solo estilo propio y elementos  
    return html`<style include="style-general"></style>
      <style>
        #linea:hover > #ver_pedido { background-color: #CCC; }	 
        #linea:active > #ver_pedido { background-color: #dc0018; color: white; }	 
        .col-Notas {width: 50%;}
        .col-Fecha {width: 72%;}
        @media only screen and (min-width: 768px) {
        /* For desktop: */
        .col-Notas {width: 50%;}
        .col-Fecha {width: 90%;}
        }
        
        [class*="cab-"]{
          font-size:14px;
          font-weight:bold;
        }
      </style>

      <center><div id="subtitulo">Lista Recuentos</div></center>
      <div>
        <vaadin-text-field style="width:45px;" disabled value="Desde"></vaadin-text-field> 
        <vaadin-date-picker id="txt_fecha1" on-value-changed="_preconsultar" i18n="[[i18n_fecha]]"></vaadin-date-picker>
        <vaadin-text-field style="width:15px;" disabled value="a"></vaadin-text-field>
        <vaadin-date-picker id="txt_fecha2" on-value-changed="_preconsultar" i18n="[[i18n_fecha]]"></vaadin-date-picker>
        <vaadin-button id="consultar_button" on-click="_consultar" theme="icon" aria-label="Consultar"><iron-icon icon="search"></iron-icon></vaadin-button><br>
      </div>
      <div>
      </div>
      <vaadin-grid theme="compact" id="grid" items="[[items]]" height-by-rows>
        <vaadin-grid-column resizable>
          <template class="header" ></template>
          <template >
            <div id="linea" on-click="_verRecuento">
              <vaadin-text-field id="Fecha-[[index]]" value="[[item.Fecha]] [[item.Notas]]" class="col-Fecha" disabled></vaadin-text-field>
              <vaadin-button id="ver_recuento" theme="icon" class="col-Ver" aria-label="Ver Recuento"><iron-icon icon="vaadin:angle-right"></iron-icon></vaadin-button>
            </div>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
      `;
    }

    static get is() {
        //Nombre del recurso a utilizar desde index <clase-nueva></clase-nueva>
        return 'lista-recuentos';
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
    }

    ready() {
      super.ready();
        //Desde aqui hacia abajo todo igual
        this.$.txt_fecha1.value = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0];
        this.$.txt_fecha2.value = new Date().toISOString().split("T")[0];
        document.getElementById("loader").style.visibility = "hidden";
        this.$.grid.items = datos;
        this.editing = null;
      }
    _isEditing(editing, item) {
      return item === editing;
    }
    _preconsultar(e){
      clearTimeout(timeout);
      var self = this;
      timeout = setTimeout(function () {self._consultar();}, 1000);
    }
    _lanzar(values){
      var mapForm = document.createElement("form");
        mapForm.target = "_blank";    
        mapForm.method = "POST";
        var l_action ="Ver_recuento.php";
        mapForm.action = l_action;
        // Create an input
        var mapInput = document.createElement("input");
        mapInput.type = "text";
        mapInput.name = "data";
        mapInput.value = JSON.stringify(values);
        
        // Add the input to the form
        mapForm.appendChild(mapInput);
        
        // Add the form to dom
        document.body.appendChild(mapForm);
        
        // Just submit
        mapForm.submit();
        document.body.removeChild(mapForm);
      }
    _verRecuento(e){
      var item = e.model.item;
      var txt_id_recuento = item.Id_Recuento;
      var txt_fecha = item.Fecha;
      var txt_notas = item.Notas;
      var self = this;
      var sp_load = document.getElementById("loader");
      sp_load.style.visibility = "visible";

      var values = { Login:[{email: '<?php echo $_SESSION["session_email"]; ?>',pass:'<?php echo $_SESSION["session_pass"]; ?>'}],Recuento:{Id_Recuento:txt_id_recuento}};
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "../../Detalle_recuento.php",
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
            alert("Error al buscar recuento");  
            }
          }
          else
          {
            try{
              for ( var i=0;i<Data.Lista[2].Datos.length;i++){
                if (Data.Lista[2].Datos[i].Uds.length != 0){
                  Data.Lista[2].Datos[i].Uds = parseFloat(Data.Lista[2].Datos[i].Uds).toFixed(2).replace(".", ",").replace(",00","").trim();}
                }
                var values = { Login:[{email: '<?php echo $_SESSION["session_email"]; ?>',pass:'<?php echo $_SESSION["session_pass"]; ?>'}],Id_Recuento:txt_id_recuento,Lista:Data.Lista[2].Datos,Notas:txt_notas,Fecha:txt_fecha};
                self._lanzar(values);
            
              }
            catch (err){
              alert(err);
            }
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          sp_load.style.visibility = "hidden";
          alert("Error de conexión.Imposible obtener información"+JSON.stringify(jqXHR));
        }
      });
    
    }
    _consultar(e) {
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
      if (new Date(this.$.txt_fecha1.value).getTime() < new Date(this.$.txt_fecha2.value).getTime()){
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
          url: "../../Historial_recuentos.php",
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
                alert("Error al buscar recuentos");                
              }
            }
            else
            {
              try{
                datos = Data.Lista[2].Datos;
                for( var i=0;i<datos.length;i++){
                  var l_fecha = new Date(datos[i].Fecha.replace(" ","T"));
                  var month = '' + (l_fecha.getMonth() + 1).toString();
                  var day = '' + l_fecha.getDate().toString();
                  var year = l_fecha.getFullYear().toString();
                  var hour = l_fecha.getHours().toString();
                  var minutes = l_fecha.getMinutes().toString();
                  var seconds = l_fecha.getSeconds().toString();	
                  if (month.length < 2) month = '0' + month;
                  if (day.length < 2) day = '0' + day;
                  if (hour.length < 2) hour = '0' + hour;
                  if (minutes.length < 2) minutes = '0' + minutes;
                  if (seconds.length < 2) seconds = '0' + seconds;
                  datos[i].Fecha = day+"-"+month+"-"+year+" "+hour+":"+minutes+":"+seconds	
                }
              }
              catch (err){
                alert("Error al procesar datos de recuentos");
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
      else{
        sp_load.style.visibility = "hidden";
        alert("Revise las fechas: Fecha 'Desde' superior a fecha 'Hasta'");
      }
   }      
  }//fin declaración funciones

customElements.define(ListadoRecuentos.is, ListadoRecuentos);      