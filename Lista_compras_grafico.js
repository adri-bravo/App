import { PolymerElement, html } from "./node_modules/@polymer/polymer/polymer-element.js";
//Declaración de variables.
var data_delete = [];
var datos = [];
var datos2 = [];
var proveedores = [];
var barChart;
var l_etiquetas = [];
var l_actual = [];
var l_anterior = [];
var timeout = null;
var listo = 0;
class ListaComprasGrafico extends PolymerElement {
  
    static get template() { 
    //Elementos HTML
    //Incluir solo estilo propio y elementos  
    return html`
    
    <style include="style-general"></style>
      <style>
        #div_label_total{
            display: table;
            text-align: left;
        }	
            
        .chart-container{
            position: relative; 
            height:200px; 
            width:100%;
        }
        @media only screen and (min-width: 768px) {
            .chart-container{
            position: relative; 
            height:400px; 
            width:100%;
            }
        }	
      </style>
      <center><div id="subtitulo">Gráfico Historial compras</div></center>
      <div>
        <vaadin-text-field id="Producto" label="Producto" on-value-changed="_preconsultar" ></vaadin-text-field>
        <vaadin-combo-box id="Proveedor" label="Proveedor" on-value-changed="_preconsultar" item-label-path="Proveedor" item-value-path="Proveedor" allow-custom-value ></vaadin-combo-box>      
        <br>
        <vaadin-text-field style="width:45px;" disabled value="Desde"></vaadin-text-field> 
		    <vaadin-date-picker id="txt_fecha1" on-value-changed="_preconsultar" i18n="[[i18n_fecha]]"></vaadin-date-picker>
	      <vaadin-text-field style="width:15px;" disabled value="a"></vaadin-text-field>
		    <vaadin-date-picker id="txt_fecha2" on-value-changed="_preconsultar" i18n="[[i18n_fecha]]"></vaadin-date-picker>
	      <vaadin-button on-click="_consultar" theme="icon" aria-label="Consultar"><iron-icon icon="search"></iron-icon></vaadin-button><br>
        <vaadin-checkbox id="chb_regalo" unchecked on-checked-changed="_preconsultar">Incluir Regalos</vaadin-checkbox>
      </div>
      
      <div class="chart-container">
        <canvas id="popChart" ></canvas>
      </div> 
      <center><div id="div_label_total"><label id="lbl_total"></label></div></center>`;
    }

    static get is() {
        //Nombre del recurso a utilizar desde index <clase-nueva></clase-nueva>
        return 'lista-compras-grafico';
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
              sp_load.style.visibility = "hidden";
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
      _consultar(e) {
        var sp_load = document.getElementById("loader");
        var self = this;
        sp_load.style.visibility = "visible";
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
                  self._consultar_ant();	 
                }
                catch (err){
                }
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              sp_load.style.visibility = "hidden";
              alert("Error de conexión.Imposible obtener información"+JSON.stringify(jqXHR));
            }
          });

        }
       }
       _consultar_ant(e) {
        var l_dias_actual = new Date(this.$.txt_fecha2.value).getTime() - new Date(this.$.txt_fecha1.value).getTime();;
        var l_dias_anterior = new Date((parseInt(this.$.txt_fecha2.value.substring(0,4)) -1)+this.$.txt_fecha2.value.substring(4)).getTime() - new Date((parseInt(this.$.txt_fecha1.value.substring(0,4)) -1)+this.$.txt_fecha1.value.substring(4)).getTime();	 
        this.editing = null;
        var sp_load = document.getElementById("loader");
        sp_load.style.visibility = "visible";
        var self = this;
        var l_where = "";
        if(this.$.txt_fecha1.value.length != 0){
          if (l_where.length == 0){
            l_where = " where ( Fecha >= '"+ (parseInt(this.$.txt_fecha1.value.substring(0,4)) -1)+this.$.txt_fecha1.value.substring(4) +" 00:00:00'" ;
          }
          else
          {
            l_where = l_where + " and ( Fecha >= '"+ (parseInt(this.$.txt_fecha1.value.substring(0,4))+this.$.txt_fecha1.value.substring(4) -1) + " 00:00:00'" ;
          }
        }
        if(this.$.txt_fecha2.value.length != 0){
          if (l_where.length == 0){
            l_where = " where Fecha <= '"+ (parseInt(this.$.txt_fecha2.value.substring(0,4)) -1)+this.$.txt_fecha2.value.substring(4) +" 23:59:59')" ;
          }
          else
          {
            l_where = l_where + " and Fecha <= '"+ (parseInt(this.$.txt_fecha2.value.substring(0,4)) -1)+this.$.txt_fecha2.value.substring(4) +" 23:59:59')" ;
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
          catch (e){}
          var values = { Login:[{email: 'a',pass:'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'}],Find:[l_encodedUrl]};
          datos2=[];
          $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "../../Listado.php",
            traditional: true,   //must be tru for arrray to be send 
            data: JSON.stringify(values),
            dataType: "json",
            success: function (Data) {
              sp_load.style.visibility = "hidden";
              l_etiquetas = [];
              l_anterior = [];
              l_actual = [];
              try{
                datos2 = Data.Lista[2].Datos;
                var l_total_actual = 0;
                var l_total_anterior = 0;
                //Agrupar datos
                var l_datos2 = [];
                for (var i=0;i<datos2.length;i++){
                  if ((datos2[i].Producto.substring(0,3) === "Tot") || (datos2[i].Producto.substring(0,3) === "TOT")){
                  }
                  else{
                    l_total_anterior = l_total_anterior + parseFloat(datos2[i].Importe);
                  }
                  l_encontrado = false;
                  for (var e=0;e<l_datos2.length;e++){
                    if (l_datos2[e].Producto === datos2[i].Producto){
                      l_encontrado = true;
                      l_datos2[e].Uds = l_datos2[e].Uds + parseFloat(datos2[i].Uds);
                    }
                  }
                  if (l_encontrado == false){
                    l_datos2.push({Producto:datos2[i].Producto,Uds:parseFloat(datos2[i].Uds)});
                  }
                }
                datos2 = l_datos2;
                //Agrupar datos
                var l_datos = [];
                for (var i=0;i<datos.length;i++){
                  if ((datos[i].Producto.substring(0,3) === "Tot") || (datos[i].Producto.substring(0,3) === "TOT")){
                  }
                  else{
                    l_total_actual = l_total_actual + parseFloat(datos[i].Importe);
                  }
                  l_encontrado = false;
                  for (var e=0;e<l_datos.length;e++){
                    if (l_datos[e].Producto === datos[i].Producto){
                      l_encontrado = true;
                      l_datos[e].Uds = l_datos[e].Uds + parseFloat(datos[i].Uds);
                    }
                  }
                  if (l_encontrado == false){
                    l_datos.push({Producto:datos[i].Producto,Uds:parseFloat(datos[i].Uds)});
                  }
                }
                datos = l_datos;
                for (var i=0; i<datos.length;i++){
                  if ((datos[i].Producto.substring(0,3) === "Tot") || (datos[i].Producto.substring(0,3) === "TOT")){
                  }
                  else{
                    l_etiquetas.push(datos[i].Producto);
                    l_actual.push(parseFloat(datos[i].Uds).toFixed(2));
                  }
                }
              
                //Añadir datos de año anterior de productos correspondientes en el año actual	
                for (var e=0;e<l_etiquetas.length;e++){
                  var l_encontrado = false;
                  for (var i=0;i<datos2.length;i++){
                    if (l_etiquetas[e] === datos2[i].Producto){
                      l_encontrado = true;
                      l_anterior.push(parseFloat(datos2[i].Uds).toFixed(2));
                      break;	
                    }
                  }
                  if (l_encontrado == false){
                    l_anterior.push("0");
                  }
                }
                //Añadir datos de año anterior sin productos correspondientes en año actual
                for (var i=0;i<datos2.length;i++){
                  if ((datos2[i].Producto.substring(0,3) === "Tot") || (datos2[i].Producto.substring(0,3) === "TOT")){
                  }
                  else{
                    l_encontrado = false;
                    for (var e=0;e<l_etiquetas.length;e++){
                      if (l_etiquetas[e] === datos2[i].Producto){
                        l_encontrado = true;
                      }
                    }
                    if (l_encontrado == false){
                      console.log(datos2[i].Producto+":"+datos2[i].Uds)
                      l_anterior.push(parseFloat(datos2[i].Uds).toFixed(2).replace(".",",").replace(",00",""));
                      l_actual.push("0");
                      l_etiquetas.push(datos2[i].Producto);
                    }
                  }
                }
              }
              catch (err){
                console.log(err);
              }
              var l_media_actual = parseFloat(l_total_actual / (l_dias_actual/(1000*60*60*24)/7)).toFixed(2).replace(".",",");
              var l_media_anterior = parseFloat(l_total_anterior / (l_dias_anterior/(1000*60*60*24)/7)).toFixed(2).replace(".",",");

              l_total_anterior = parseFloat(l_total_anterior).toFixed(2).replace(".",",");
              l_total_actual = parseFloat(l_total_actual).toFixed(2).replace(".",",");
              self.$.div_label_total.innerHTML = "<label id='lbl_total'>Total actual: "+ l_total_actual+"<br>Media actual: "+ l_media_actual + "<br>Total anterior: "+l_total_anterior+"<br>Media anterior: "+ l_media_anterior + "</label>";
              //var popCanvas = document.getElementById("popChart");
              var popCanvas = self.$.popChart;
              Chart.defaults.global.defaultFontFamily = "Lato";
              Chart.defaults.global.defaultFontSize = 14;
              Chart.defaults.global.defaultFontColor = 'Black';
              try{barChart.destroy();}catch(err){};
              barChart = new Chart(popCanvas, {
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: {
                    display: false
                    },
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero:true
                      }
                    }]
                  }
                  
                },
                type: 'bar',
                
                data: {
                labels: l_etiquetas,
                datasets: [{
                  label: 'Consumo anterior',
                  data: l_anterior,
                  backgroundColor: '#f2b5b7'
                  
                },{
                  label: 'Consumo actual',
                  data: l_actual,
                  backgroundColor: '#dc0018'
                  
                }]
                }
              });              
            },
            error: function (jqXHR, textStatus, errorThrown) {
              //sp_load.active = false;
              sp_load.style.visibility = "hidden";
              alert("Error de conexión.Imposible obtener información"+JSON.stringify(jqXHR));
            }
          });
        }
    }
  
  }//fin declaración funciones

customElements.define(ListaComprasGrafico.is, ListaComprasGrafico);      