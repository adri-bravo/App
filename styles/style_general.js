import { PolymerElement, html } from "../node_modules/@polymer/polymer/polymer-element.js";
const template_header = document.createElement('dom-module');
template_header.innerHTML=`<template>    
<style>

vaadin-grid vaadin-text-field {
    width: 100%;
    
  }


#subtitulo{
	font-size:18px;
	font-weight:bold;
	color:#dc0018;
	padding-bottom:10px;
	}
@media only screen and (min-width: 768px) {
#subtitulo{
	font-size:32px;
	}

}	



h1{
color:#0C9;}
 

#lower {
    background: #ffb3b3;
    width: 100%;
    height: 69px;
    margin-top: 20px;
	box-shadow: inset 0 1px 1px #fff;
    border-top: 1px solid #ccc;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
}

 
</style>

</template>`;
 template_header.register('style-general');
 
 const $template_date_picker = document.createElement('template');
$template_date_picker.innerHTML = `<dom-module id="custom-date-picker" theme-for="vaadin-date-picker">
  <template>
    <style>
          :host [part="clear-button"]{
            display:none;
          }
      :host [part="text-field"] {
        font-size: 12px;
      }

@media only screen and (min-width: 768px) {
      :host [part="text-field"] {
        font-size: 14px;
      }
}
    </style>
  </template>
</dom-module>`;
const $template_combo = document.createElement('template');
$template_combo.innerHTML = `
<dom-module id="remove-combo-clear-button" theme-for="vaadin-combo-box">
    <template>
        <style>
        
        :host [part="toggle-button"] {
        	font-size: 12px;
      		}
        
@media only screen and (min-width: 768px) {
    :host [part="toggle-button"] {
        font-size: 14px;
          }

    }			
    </style>
    </template>
</dom-module>`;
const $template_text = document.createElement('template');
$template_text.innerHTML = `
<dom-module id="custom-text-field" theme-for="vaadin-text-field">
    <template>
        <style>
       
       :host [part="label"] {
              font-size: 12px;
                            
      		}
            @media only screen and (min-width: 768px) {
                :host [part="label"] {
                    font-size: 14px;
                }
            }		
        :host [part="input-field"] {
        	    font-size: 12px;
      		}
            @media only screen and (min-width: 768px) {
                :host [part="input-field"] {
                    font-size: 14px;
                }
            }		
        
            	
    </style>
    </template>
</dom-module>`;

const $template_checkbox = document.createElement('template');
$template_checkbox.innerHTML = `
<dom-module id="custom-checkbox" theme-for="vaadin-checkbox">
    <template>
        <style>
       :host [part="label"] {
              font-size: 12px;
              
              
      		}
            @media only screen and (min-width: 768px) {
                :host [part="label"] {
                    font-size: 14px;
                   
                }
            }		
            	
    </style>
    </template>
</dom-module>`;


const $template_time_picker = document.createElement('template');
$template_time_picker.innerHTML = `<dom-module id="custom-time-picker" theme-for="vaadin-time-picker-text-field">
  <template>
    <style>
      :host {
        font-size: 12px;
      }

@media only screen and (min-width: 768px) {
      :host {
        font-size: 14px;
      }
}
    </style>
  </template>
</dom-module>`;
document.head.appendChild($template_combo.content);
document.head.appendChild($template_text.content);
document.head.appendChild($template_checkbox.content);
// Los date y time picker se controlan ya con el text-field
//document.head.appendChild($template_time_picker.content);
//document.head.appendChild($template_date_picker.content);
