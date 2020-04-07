import { PolymerElement, html } from "./node_modules/@polymer/polymer/polymer-element.js";
//import {setPassiveTouchGestures} from './node_modules/@polymer/polymer/lib/utils/settings.js';
//setPassiveTouchGestures(true);
//document.addEventListener('touchstart', handler, true);

var data_delete = [];
var datos = [];
var timeout = null;
var categorias = [];
var unidades = {};
var proveedores = [];

class EditarProductos extends PolymerElement {
	
	static get template() {
	  return html`<style include="style-general"></style>
		<center><div id="subtitulo">Editar Productos</div></center>
		<style>
 			  [class*="cab-"]{
			  font-size:12px;
			 font-weight:bold;
			 }
			 @media only screen and (max-width: 768px) {
				#Producto{width:30%;}
				#Proveedor{width:30%;}
			 }
			
			.cab-Proveedor {width: 33%;}
			.cab-Producto {width: 45%;}
			.cab-Importe{width: 22%;}
			
			.cab-Referencia{width: 30%;}
			.cab-Categoria{width: 30%;}
			.cab-Uds {width: 25%;}
			.cab-Unidad{width: 15%;}
			
			.cab-Uds_rapel {width: 60%;}
			.cab-Fecha_rapel {width: 40%;visibility:visible;}
			.cab-Fecha_col{width: 18%;visibility:visible;}
			.cab-Uds_rapel_col{width: 15%;;visibility:visible;}
			
			
			.col-Proveedor {width: 33%;}
			.col-Producto {width: 45%;}
			.col-Importe{width: 22%;}
			
			.col-Referencia{width: 30%;}
			.col-Categoria{width: 40%;}
			.col-Uds {width: 15%;}
			.col-Unidad{width: 15%;}
			
			.col-Uds_rapel {width: 18%;}
			.col-Fecha_rapel {width:35%;}
			.col-Porcen_rapel{width:14%}

			 .divisor1{display:block}
			.divisor2{display:block}
			.divisorcab{display:block}
			@media only screen and (min-width: 768px) {
			
			/* For desktop: */
			.cab-Proveedor {width: 10%;}
			.cab-Producto {width: 20%;}
			.cab-Uds {width: 6%;}
			.cab-Importe{width: 7%;}
			.cab-Referencia{width: 10%;}
			.cab-Categoria{width: 14%;}
			.cab-Unidad{width: 5%;}
			.cab-Uds_rapel {width: 7%;}
			.cab-Fecha_rapel {width: 12%;visibility:visible;}
			
			.cab-Uds_rapel_col{width: 7%;display:none;}
			.cab-Fecha_col{width: 13%;display:none;}

			
			.col-Proveedor {width: 10%;}
			.col-Producto {width: 20%;}
			.col-Uds {width: 6%;}
			.col-Importe{width: 7%;}
			.col-Referencia{width: 10%;}
			.col-Categoria{width: 14%;}
			.col-Unidad{width: 5%;}
			.col-Uds_rapel{width: 7%;}
			.col-Fecha_rapel{width: 12%;}
			.col-Porcen_rapel{width: 5%;}


			.divisor1{display:none}
			.divisor2{display:none}
			.divisorcab{display:none}
			}
    	</style>

		<div>
			<vaadin-text-field id="Producto"  label="Producto" on-value-changed="_preconsultar" ></vaadin-text-field>
			<vaadin-combo-box id="Proveedor" label="Proveedor" on-value-changed="_preconsultar" item-label-path="Alias" item-value-path="Alias" allow-custom-value ></vaadin-combo-box>
			<vaadin-button id="consultar_button" on-click="_consultar" theme="icon" aria-label="Consultar"><iron-icon icon="search"></iron-icon></vaadin-button><br>
		</div>
		<div>
			<vaadin-button id="add-button" on-click="_add" theme="icon" aria-label="Nuevo Producto"><iron-icon icon="vaadin:plus"></iron-icon></vaadin-button>
			<vaadin-button id="save_button" on-click="_guardar" theme="icon" aria-label="Guardar"><iron-icon icon="save"></iron-icon></vaadin-button>
			<vaadin-text-field class="lbl_fechas" style="width:55px;"  value="F.Rapel"></vaadin-text-field><vaadin-date-picker theme="custom" id="Fecha_rapel_All"  i18n="[[i18n_fecha]]">
			</vaadin-date-picker><vaadin-button id="rapel-button" on-click="_setRapel" theme="icon" aria-label="Establecer Fecha Rapel"><iron-icon icon="vaadin:arrow-down"></iron-icon></vaadin-button>
		</div>
		<vaadin-grid theme="compact" id="grid" items="[[items]]" height-by-rows>
	
		<vaadin-grid-column width="80%">
			<template class="header" >
				<vaadin-text-field class="cab-Proveedor" value="Proveedor"  readonly=true></vaadin-text-field>
				<vaadin-text-field class="cab-Producto" value="Producto" readonly=true></vaadin-text-field>
				<vaadin-text-field theme="align-right" class="cab-Importe" value="€" readonly=true></vaadin-text-field>
				<div class="divisorcab"></div>
				<vaadin-text-field class="cab-Referencia" value="Referencia"  readonly=true></vaadin-text-field>
				<vaadin-text-field class="cab-Categoria" value="Categoria" readonly=true></vaadin-text-field>
				<vaadin-text-field theme="align-right" class="cab-Uds" value="Uds.Min" readonly=true></vaadin-text-field>
				<vaadin-text-field class="cab-Unidad" value="U.M."  readonly=true></vaadin-text-field>
				<div class="divisorcab"></div>
				
				<vaadin-text-field class="cab-Fecha_rapel" value="F.Rapel" readonly=true></vaadin-text-field>
				<vaadin-text-field  theme="align-right" class="cab-Uds_rapel" value="Rapel" readonly=true></vaadin-text-field>
			</template>
			<template>
			<div on-click="_selecciona">
			
				<vaadin-combo-box class="col-Proveedor" id="Proveedor-[[index]]" placeholder="Proveedor" item-label-path="Alias" item-value-path="Alias" value="[[item.Proveedor]]" disabled="[[!_isEditing(editing, item)]]" allow-custom-value ></vaadin-combo-box>
				<vaadin-text-field class="col-Producto" id="Producto-[[index]]" value="[[item.Producto]]" placeholder="Producto"  disabled="[[!_isEditing(editing, item)]]"></vaadin-text-field>
				<vaadin-text-field theme="align-right" class="col-Importe"  id="Importe-[[index]]" value="[[item.Importe]]" placeholder="€" disabled="[[!_isEditing(editing, item)]]"></vaadin-text-field>
								
				<div class="divisor1"></div>
				
				<vaadin-text-field class="col-Referencia" id="Referencia-[[index]]" value="[[item.Referencia]]" placeholder="Referencia" disabled="[[!_isEditing(editing, item)]]"></vaadin-text-field>
				<vaadin-combo-box class="col-Categoria" id="Categoria-[[index]]" placeholder="Categoria" item-label-path="Categoria" item-value-path="Categoria" value="[[item.Categoria]]" disabled="[[!_isEditing(editing, item)]]" allow-custom-value ></vaadin-combo-box>
				<vaadin-text-field theme="align-right" class="col-Uds"  id="Uds-[[index]]" value="[[item.Uds]]" placeholder="Min" disabled="[[!_isEditing(editing, item)]]"></vaadin-text-field>
				<vaadin-combo-box class="col-Unidad" id="Unidad-[[index]]" placeholder="U.Medida" item-label-path="Unidad" item-value-path="Unidad" value="[[item.Unidad]]" disabled="[[!_isEditing(editing, item)]]" allow-custom-value ></vaadin-combo-box>
				
				<div class="divisor1"></div>
			
				<vaadin-text-field class="cab-Fecha_col"  disabled value="F.Rapel"></vaadin-text-field><vaadin-date-picker  class="col-Fecha_rapel" id="Fecha_rapel-[[index]]" value="[[item.Fecha_rapel]]" disabled="[[!_isEditing(editing, item)]]" i18n="[[i18n_fecha]]" ></vaadin-date-picker>
				<vaadin-text-field class="cab-Uds_rapel_col"  disabled value="Rapel"></vaadin-text-field><vaadin-text-field theme="align-right" class="col-Uds_rapel"  id="Uds_rapel-[[index]]" value="[[item.Uds_rapel]]" placeholder="Rap" disabled="[[!_isEditing(editing, item)]]"></vaadin-text-field>
				<vaadin-checkbox class="col-Porcen_rapel" id="Porcen-[[index]]"  value="[[item.Porcen]]" checked="[[item.Porcen]]" disabled="[[!_isEditing(editing, item)]]" >%</vaadin-checkbox>

			</div>
			</template>
		</vaadin-grid-column>

		<vaadin-grid-column width="20%" >
			<template class="header" >
				<vaadin-checkbox id="CheckAll" unchecked on-checked-changed="_selectAll">Todos</vaadin-checkbox>
			
			</template >

			<template >
			<div >
				<vaadin-checkbox id="Checked-[[index]]" value="[[item.Checked]]" checked="[[item.Checked]]" on-checked-changed="_select"  style="display:[[_display_check(editing,item)]]" ></vaadin-checkbox>
				<div class="divisor1"></div>
				<vaadin-button id="edit-button" hidden="[[editing]]" on-click="_edit"  theme="icon" aria-label="Edit"><iron-icon icon="vaadin:edit"></iron-icon></vaadin-button>
				<vaadin-button hidden="[[editing]]" on-click="_remove" theme="icon error" aria-label="Delete"><iron-icon icon="vaadin:trash"></iron-icon></vaadin-button>

				<vaadin-button hidden="[[!_isEditing(editing,item)]]" on-click="_save"  theme="primary">OK</vaadin-button><div class="divisor2"></div>
				<vaadin-button hidden="[[!_isEditing(editing, item)]]" on-click="_cancel">Cancel</vaadin-button>
			</div>
			</template>
		</vaadin-grid-column>
		</vaadin-grid>

		<div id="loader" ></div>
	`;}

	static get is() {
		return 'editar-productos';
	}
	
	constructor() {
		super();
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
		// To force all event listeners for gestures to be passive.
		// See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
		//setPassiveTouchGestures(true);
	}
	  
	ready() {
		super.ready();
		
		this.$.loader.style.visibility = "hidden";
		this._iniciar();
		this.$.Fecha_rapel_All.value = new Date().toISOString().split("T")[0];
		this.$.grid.items = datos;
		this.editing = null;
		data_delete = [];
        }
	_select(e){
		
			try{
				var item = e.model.item;
				var checkbox = this.$.grid.querySelector('#Checked-' + e.model.index);
				item.Checked = checkbox.checked;
				this.$.grid.clearCache();			
			}
			catch (error){
				//alert("Error al seleccionar");
				}
		
	}
	_selectAll(e){
		try{
			var checkbox = this.$.grid.querySelector('#CheckAll');
			for(var i=0;i<datos.length;i++){
				datos[i].Checked = checkbox.checked; 
			}
		this.$.grid.clearCache();			
		}
		catch (error){
			//alert("Error al seleccionar2");
		}
	}

	_selecciona(e){
		var item = e.model.item;
		if(this.editing===item){}
		else{
		item.Checked = !item.Checked;
		this.$.grid.clearCache();
		}
	}
	
	_display_check(editing,item){

		if(editing==item){
			return "none";
		}
		else
		{
		return "visible";
		}
			
	}
	_setRapel(){
		for(var i=0;i<datos.length;i++)
		{
		if (datos[i].Checked == true){
			datos[i].Fecha_rapel = this.$.Fecha_rapel_All.value;
			}
		}
		this.$.grid.clearCache();
	}
	_iniciar(){
		// - Buscar Categorias -> Consultar
		// - Buscar Unidades -> Consultar
		// - Buscar Proveedores -> Consultar
		categorias = [];
		unidades = [];
		proveedores = [];
		var self = this;
		var sp_load = this.$.loader;
			sp_load.style.visibility = "visible";

		var values = {Login:[{email: '<?php echo $_SESSION["session_email"]; ?>',pass:'<?php echo $_SESSION["session_pass"]; ?>'}]};
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
					}
					else
					{
						categorias = Data.Lista[2].Datos;
					}
			},
			error (jqXHR, textStatus, errorThrown) {
				alert("Error de conexión.Imposible obtener información");
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
					}
					else
					{
					unidades = Data.Lista[2].Datos;
					}
			},
			error (jqXHR, textStatus, errorThrown) {
				alert("Error de conexión.Imposible obtener información");
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
					}
					else
					{
					proveedores = Data.Lista[2].Datos;
					var cmb_proveedor = self.$.Proveedor;
					cmb_proveedor.items = proveedores;
					}

			},
			error (jqXHR, textStatus, errorThrown) {
				alert("Error de conexión.Imposible obtener información");
			}
		});				
		
	}
	_isEditing(editing, item) {
		return item === editing;
	}

	_edit(e) {
		var item = e.model.item;
		if (item){
			//console.log("editando");
			this.editing = item;
			var cmb_categoria = this.$.grid.querySelector('#Categoria-' + e.model.index);
			cmb_categoria.items = categorias;
			var cmb_unidades = this.$.grid.querySelector('#Unidad-' + e.model.index);
			cmb_unidades.items = unidades;
			var cmb_proveedores = this.$.grid.querySelector('#Proveedor-' + e.model.index);
			cmb_proveedores.items = proveedores;
			var btn_save = this.$.save_button;
			btn_save.disabled = true;
			if (item.CodProv.length > 0) 
			{
				var txt_referencia = this.$.grid.querySelector('#Referencia-' + e.model.index);
				txt_referencia.disabled = true;
				var cmb_proveedor = this.$.grid.querySelector('#Proveedor-' + e.model.index);
				cmb_proveedor.disabled = true;
			}
		}
	}

	_save(e) {
		var item = e.model.item;
		var encontrado = false;
		for(var i=0;i<categorias.length;i++){
			if (categorias[i].Categoria == this.$.grid.querySelector('#Categoria-' + e.model.index).value){
				encontrado = true;
				}
				if (encontrado == true){
					break;
					}
			}
			if (encontrado == false){
				categorias.push({Categoria:this.$.grid.querySelector('#Categoria-' + e.model.index).value});
				}
		encontrado = false;
		for(var i=0;i<unidades.length;i++){
			if (unidades[i].Unidad == this.$.grid.querySelector('#Unidad-' + e.model.index).value){
				encontrado = true;
				}
				if (encontrado == true){
					break;
					}
			}
			if (encontrado == false){
				unidades.push({Unidad:this.$.grid.querySelector('#Unidad-' + e.model.index).value});
				}	  
		item.Producto = this.$.grid.querySelector('#Producto-' + e.model.index).value;
		
		if (item.CodProv.length == 0){
		
			item.Proveedor = this.$.grid.querySelector('#Proveedor-' + e.model.index).value;
			for(var i=0;i<proveedores.length;i++){
				if (proveedores[i].Alias === item.Proveedor){
					item.CodProv = proveedores[i].CodProv;
					break;
				}
			}
		}
		
		
		item.Categoria = this.$.grid.querySelector('#Categoria-' + e.model.index).value;
		item.Unidad = this.$.grid.querySelector('#Unidad-' + e.model.index).value;
		item.Referencia = this.$.grid.querySelector('#Referencia-' + e.model.index).value;
		if (this.$.grid.querySelector('#Importe-' + e.model.index).value.length > 0)
		{item.Importe = this.$.grid.querySelector('#Importe-' + e.model.index).value;
		}else {item.Importe = "0.0";}
		
		if (this.$.grid.querySelector('#Uds-' + e.model.index).value.length > 0)
		{
		item.Uds = this.$.grid.querySelector('#Uds-' + e.model.index).value;
		}else {item.Uds = 0;}
		if (this.$.grid.querySelector('#Uds_rapel-' + e.model.index).value.length > 0)
		{
		item.Uds_rapel = this.$.grid.querySelector('#Uds_rapel-' + e.model.index).value;
		}else {item.Uds_rapel = 0;}
		
		item.Fecha_rapel = this.$.grid.querySelector('#Fecha_rapel-' + e.model.index).value;
		item.Porcen = this.$.grid.querySelector('#Porcen-' + e.model.index).checked;
		this.editing = null;
		var btn_save = this.$.save_button;
		btn_save.disabled = false;

		this.$.grid.clearCache();
	}

	_cancel() {
		this.editing = null;
		var btn_save = this.$.save_button;
		btn_save.disabled = false;
		
		this.$.grid.clearCache();
	}

	_add(e) {
		var l_proveedor = "";
		if (this.$.Proveedor.value.length > 0){
			l_proveedor = this.$.Proveedor.value;
			}
		this.$.grid.items.unshift( {Id_producto:-1,Uds:1,Producto:"",Proveedor:l_proveedor,Unidad:"",Categoria:"",Importe:"0.0",Referencia:"",CodProv:"",Uds_rapel:"",Fecha_rapel:"",Fecha_precio:"0000-00-00 00:00:00",Porcen:false,Checked:false});
		this.$.grid.clearCache();
		var item = this.$.grid.items[0];
		
		this.editing = item;
		var cmb_categoria = this.$.grid.querySelector('#Categoria-0');
		cmb_categoria.items = categorias;
		var cmb_unidades = this.$.grid.querySelector('#Unidad-0');
		cmb_unidades.items = unidades;
		var cmb_proveedores = this.$.grid.querySelector('#Proveedor-0');
		cmb_proveedores.items = proveedores;
		var btn_save = this.$.save_button;
		btn_save.disabled = true;

		//this.$.grid.querySelector('#Proveedor-' + 0).focus();
	}
	_preconsultar(e) {
		clearTimeout(timeout);
		var self = this;
		//console.log("precons");
		timeout = setTimeout(function () {self._consultar();}, 1000);
		}
		_consultar(e) {
		
				this.editing = null;
				this.$.save_button.disabled = false;
			var sp_load = this.$.loader;
			sp_load.style.visibility = "visible";
		if ( data_delete.length >0){
			alert("OJO hay " + data_delete.length + " productos pendientes de borrar");
			}
		this.$.grid.items = [];
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

		var values = { Login:[{email: 'a',pass:'f47b788dcaa1686c0920895ab53306700d0f97c34b9dc08aa1f6847e5032b892932013608eda4193e03c2e409dac57debf692b16d2587d61e958fb1984c9bea3'}],Find:[l_encodedUrl]};
		datos=[];
		var grid = this.$.grid;
		
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "../../Stock.php",
			traditional: true,   //must be tru for arrray to be send 
			data: JSON.stringify(values),
			dataType: "json",
			success (Data) {
				if (Data.Lista[0].Resultado === "NOOK"){
					try{
						for(var i = 0; i<Data.Lista[1].Errores.length;i++){
						alert(Data.Lista[1].Errores[i].Error);
						}
					}
					catch(err){
						alert("Error al obtener productos");
					}
				}
				else
				{

					try{
						datos = Data.Lista[2].Datos;
						for(var i=0;i<datos.length;i++){
							datos[i].Checked = false;
							if (datos[i].Porcen == 0){
								datos[i].Porcen = false;
							}else
							{
								datos[i].Porcen = true;
							}
						}
					}
					catch (err){
						alert("Error al procesar datos");
					}
				}
				grid.items = datos;
				grid.clearCache();
				
				sp_load.style.visibility = "hidden";
			},
			error (jqXHR, textStatus, errorThrown) {
				//sp_load.active = false;
				sp_load.style.visibility = "hidden";
				alert("Error de conexión.Imposible obtener información"+JSON.stringify(jqXHR));
			}
		});

	}
	_remove(e) {
		if(confirm("¿Seguro de eliminar el producto?"))
		{
			if (e.model.item.Id_producto != -1){
				data_delete.push(e.model.item);
			}
			this.$.grid.items.splice(e.model.index, 1);
			this.$.grid.clearCache();
		}
	}
	_guardar(e) {
			if (data_delete.length > 0){
				alert("Se van a eliminar "+data_delete.length+" productos");
			}
			var sp_load = this.$.loader;
			sp_load.style.visibility = "visible";
					var productos_guardar = [];
					var productos_borrar = [];
										for ( var i = 0; i < datos.length; i++) {
											if(datos[i].Proveedor.length != 0 && datos[i].Producto.length != 0){
												
												//if(datos[i].Fecha_precio === "0000-00-00 00:00:00"){
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
													datos[i].Fecha_precio = year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
												//}		 								 
												productos_guardar.push({Id_Producto:datos[i].Id_producto,
													Id_Usuario:datos[i].Id_Usuario,
													Proveedor:datos[i].Proveedor,
													Nombre:datos[i].Producto,
													Uds:datos[i].Uds,
													Fecha_rapel:datos[i].Fecha_rapel,
													Uds_rapel:datos[i].Uds_rapel,
													Importe_ant:datos[i].Importe_ant,
													Importe:datos[i].Importe,
													Um:datos[i].Unidad,
													Categoria:datos[i].Categoria,
													Referencia:datos[i].Referencia,
													CodProv:datos[i].CodProv,
													Fecha_precio:datos[i].Fecha_precio,
													Porcen:datos[i].Porcen})
											}
										}
									for(var i=0; i< data_delete.length; i++){
										productos_borrar.push({Id_Producto:data_delete[i].Id_producto});
										}
					var values = { Login:[{email: '<?php echo $_SESSION["session_email"]; ?>',pass:'<?php echo $_SESSION["session_pass"]; ?>'}],Borrar:productos_borrar,Guardar:productos_guardar};
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
							data_delete =[];
								// here comes your response after calling the server
								if (Data.Lista[0].Resultado === "NOOK"){
									for(var i = 0; i<Data.Lista[1].Errores.length;i++){
									alert(Data.Lista[1].Errores[i].Error);
									}
								}else{
									alert("Datos guardados correctamente.");
									self._consultar();
									}
							},
							error (jqXHR, textStatus, errorThrown) {
									sp_load.style.visibility = "hidden";
								alert("Error de conexión.No se han guardado los datos");
							}
						});			 
	

	}//fin declaración funciones
}
customElements.define(EditarProductos.is, EditarProductos);