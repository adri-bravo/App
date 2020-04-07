import { PolymerElement, html } from "./node_modules/@polymer/polymer/polymer-element.js";
var datos = [];
var timeout = null;

class ListaPedidos extends PolymerElement {
  static get template() { 
    return html`
      <style include="style-general"></style>
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
  
      <center><div id="subtitulo">Lista Pedidos</div></center>

      <div>
	      <vaadin-text-field style="width:40px;" disabled value="Desde"></vaadin-text-field> 
		    <vaadin-date-picker id="txt_fecha1" on-value-changed="_preconsultar" i18n="[[i18n_fecha]]"></vaadin-date-picker>
	      <vaadin-text-field style="width:15px;" disabled value="a"></vaadin-text-field>
		    <vaadin-date-picker id="txt_fecha2" on-value-changed="_preconsultar" i18n="[[i18n_fecha]]"></vaadin-date-picker>
	      <vaadin-button id="consultar_button" on-click="_consultar" theme="icon" aria-label="Consultar"><iron-icon icon="search"></iron-icon></vaadin-button><br>
	      <vaadin-text-field theme="bordered" id="txt_total" value="Total: 0€" disabled></vaadin-text-field>
      </div>
      <vaadin-grid theme="compact" id="grid" items="[[items]]" height-by-rows>
      <vaadin-grid-column width="90%">
        <template class="header" ></template>
          <template >
            <div id="linea" on-click="_verPedido">
              <iron-icon  id="Recibido-[[index]]" icon="[[_SetIcon(item)]]" style="fill:[[_SetColorIcon(item)]]"></iron-icon>
              <iron-icon  id="Regalo-[[index]]" icon="[[_SetIconRegalo(item)]]" style="fill:green"></iron-icon>
              <vaadin-text-field id="Fecha-[[index]]" value="[[item.Fecha]] [[item.Proveedor]] ([[item.Importe]]€)" class="col-Fecha" disabled></vaadin-text-field>
              <vaadin-button id="ver_pedido" theme="icon"  class="col-Ver" aria-label="Ver Pedido" on-click="_verPedido"><iron-icon icon="vaadin:angle-right"></iron-icon></vaadin-button>
            </div>
          </template>
      </vaadin-grid-column>
      <vaadin-grid-column width="10%">
        <template class="header" ></template>
        <template >
                   <vaadin-checkbox id="Checked-[[index]]" value="[[item.Checked]]" checked="[[item.Checked]]" on-checked-changed="_select"   ></vaadin-checkbox>
        </template>
      </vaadin-grid-column>   
                              
      </vaadin-grid>
      `;}

  static get is() {
    return 'lista-pedidos';
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
    this.$.grid.items = datos;
    this.editing = null;
  }

  _SetBackground(item) {
    return "red";
  }

  _SetColorIcon(item) {
    if (item.Recib_cli == 1) {
      return "green";
    } else if (item.Recib_prov == 1) {
      return "yellow";
    } else {}
  }

  _SetIcon(item) {
    if (item.Recib_cli == 1) {
      return "assignment-turned-in";
    } else if (item.Recib_prov == 1) {
      return "assignment-turned-in";
    } else {
      return "";
    }
  }

  _SetIconRegalo(item) {
    if (item.Regalo == 1) {
      return "card-giftcard";
    } else {
      return "";
    }
  }

  _select(e) {
    try {
      var item = e.model.item;
      var checkbox = this.$.grid.querySelector('#Checked-' + e.model.index);
      item.Checked = checkbox.checked;
      this.$.grid.clearCache();
      var l_total = parseFloat(0);

      for (var i = 0; i < datos.length; i++) {
        if (datos[i].Checked == true) {
          l_total = l_total + parseFloat(datos[i].Importe.replace(",", "."));
        }
      }

      this.$.txt_total.value = "Total: " + parseFloat(l_total).toFixed(2).replace(".", ",").replace(",00", "") + "€";
    } catch (error) {}
  }

  _isEditing(editing, item) {
    return item === editing;
  }

  _preconsultar(e) {
    clearTimeout(timeout);
    var self = this;
    if (this.$.txt_fecha1.value.length > 0) timeout = setTimeout(function () {
      self._consultar();
    }, 1000);
  }

  _verPedido(e) {
    var item = e.model.item;
    var txt_id_pedido = item.Id_Pedido;
    var txt_fecha = item.Fecha;
    var txt_notas = item.Notas;
    var txt_proveedor = item.Proveedor;
    var txt_importe = item.Importe;
    var txt_importe_real = item.Importe_real;
    var txt_Id_Externo = item.Id_Externo;
    var txt_Recib_cli = item.Recib_cli;
    var txt_Regalo = item.Regalo;
    var sp_load = document.getElementById("loader");
    sp_load.style.visibility = "visible";
    var l_where = "";
    var values = {
      Login: [{
        email: '<?php echo $_SESSION["session_email"]; ?>',
        pass: '<?php echo $_SESSION["session_pass"]; ?>'
      }],
      Pedido: {
        Id_Pedido: txt_id_pedido
      }
    };
    
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "../../Detalle_pedido.php",
      traditional: true,
      //must be tru for arrray to be send 
      data: JSON.stringify(values),
      dataType: "json",
      success: function (Data) {
        sp_load.style.visibility = "hidden";

        if (Data.Lista[0].Resultado === "NOOK") {
          
          try {
            for ( var i = 0; i < Data.Lista[1].Errores.length; i++) {
              alert(Data.Lista[1].Errores[i].Error);
            }
          } catch (err) {alert("Error al obtener datos de pedido");}
        } 
        else {
          try {
            for ( var i = 0; i < Data.Lista[2].Datos.length; i++) {
              Data.Lista[2].Datos[i].Importe = parseFloat(Data.Lista[2].Datos[i].Importe).toFixed(2).replace(".", ",").trim();

              if (Data.Lista[2].Datos[i].Uds.length != 0) {
                Data.Lista[2].Datos[i].Uds = parseFloat(Data.Lista[2].Datos[i].Uds).toFixed(2).replace(".", ",").replace(",00", "").trim();
              }
            }

            var l_proveedor;
            for ( var i = 0; i < Data.Lista[3].Proveedor.length; i++) {
              if (Data.Lista[3].Proveedor[i].Alias == txt_proveedor) {
                l_proveedor = Data.Lista[3].Proveedor[i];
              }
            }
            var mapForm = document.createElement("form");
            mapForm.target = "_blank";
            mapForm.method = "POST";
            var l_action = "Ver_pedido.php";
            mapForm.action = l_action; // Create an input

            var mapInput = document.createElement("input");
            mapInput.type = "text";
            mapInput.name = "data";
            var values = {
              Login: [{
                email: '<?php echo $_SESSION["session_email"]; ?>',
                pass: '<?php echo $_SESSION["session_pass"]; ?>'
              }],
              Id_Pedido: txt_id_pedido,
              Lista: Data.Lista[2].Datos,
              Notas: txt_notas,
              Fecha: txt_fecha,
              Proveedor: txt_proveedor,
              Importe: txt_importe + "€",
              Importe_real: txt_importe_real,
              Id_Externo: txt_Id_Externo,
              Recib_cli: txt_Recib_cli,
              Datos_proveedor: l_proveedor,
              Regalo: txt_Regalo
            };
            mapInput.value = JSON.stringify(values); // Add the input to the form

            mapForm.appendChild(mapInput); // Add the form to dom

            document.body.appendChild(mapForm); // Just submit

            mapForm.submit();
            document.body.removeChild(mapForm);
          } catch (err) {
            alert("Error al obtener datos de pedido");
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        sp_load.style.visibility = "hidden";
        alert("Error de conexión.Imposible obtener información" + JSON.stringify(jqXHR));
      }
    });
  }

  _consultar(e) {
    
    this.editing = null;
    var sp_load = document.getElementById("loader");
    sp_load.style.visibility = "visible";
    this.$.grid.items = [];
    var l_where = "";

    if (this.$.txt_fecha1.value.length != 0) {
      if (l_where.length == 0) {
        l_where = " where ( Fecha >= '" + this.$.txt_fecha1.value + " 00:00:00'";
      } else {
        l_where = l_where + " and ( Fecha >= '" + this.$.txt_fecha1.value + " 00:00:00'";
      }
    }

    if (this.$.txt_fecha2.value.length != 0) {
      if (l_where.length == 0) {
        l_where = " where Fecha <= '" + this.$.txt_fecha2.value + " 23:59:59')";
      } else {
        l_where = l_where + " and Fecha <= '" + this.$.txt_fecha2.value + " 23:59:59')";
      }
    }

    if (new Date(this.$.txt_fecha1.value).getTime() < new Date(this.$.txt_fecha2.value).getTime()) {
      var l_encodedUrl = null;

      try {
        l_encodedUrl = encodeURI(l_where);
      } catch (e) {}

      var values = {
        Login: [{
          email: 'a',
          pass: 'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'
        }],
        Find: [l_encodedUrl]
      };
      datos = [];
      var grid = this.$.grid;
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "../../Historial.php",
        traditional: true,
        //must be tru for arrray to be send 
        data: JSON.stringify(values),
        dataType: "json",
        success: function (Data) {
          sp_load.style.visibility = "hidden";

          if (Data.Lista[0].Resultado === "NOOK") {
            try {
              for (var i = 0; i < Data.Lista[1].Errores.length; i++) {
                alert(Data.Lista[1].Errores[i].Error);
              }
            } catch (err) {alert("Error al buscar datos");}
          } 
          else {
            try {
              datos = Data.Lista[2].Datos;
              
              for (var i = 0; i < datos.length; i++) {
                datos[i].Importe = parseFloat(datos[i].Importe).toFixed(2).replace(".", ",").trim();
                var l_fecha = new Date(datos[i].Fecha.replace(" ", "T")); //l_fecha = l_fecha.toString().replace(" ","T");

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
                //ACV SIN SEGUNDOS
                //datos[i].Fecha = day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds;
                datos[i].Fecha = day + "-" + month + "-" + year + " " + hour + ":" + minutes; 
                
                //Si no existe la propiedad Regalo, se genera con valor False
                if (datos[i].hasOwnProperty('Regalo') || (datos[i].Regalo = false)) {}

                datos[i].Checked = false;
              }
            } catch (err) {
              alert("Error" + err);
            }
          }

          grid.items = datos;
          grid.clearCache();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          sp_load.style.visibility = "hidden";
          alert("Error de conexión.Imposible obtener información" + JSON.stringify(jqXHR));
        }
      });
    } 
    else {
      sp_load.style.visibility = "hidden";
      alert("Revise las fechas: Fecha 'Desde' superior a fecha 'Hasta'");
    }
  }

}

customElements.define(ListaPedidos.is, ListaPedidos);