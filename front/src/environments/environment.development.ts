export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    apiSmartUA: 'https://openapi.smartua.es',
    filters: [
      "uid",
      "description_origin",
      "organizationid",
      "alias",
      "description",
      "metric",
      "name",
      "origin",
      "typemeter"
      ],
    
    tiposFechas: [
      "epoch", 
      "dia", 
      "mes", 
      "año", 
      "dia de la semana", 
      "semana",
      "hora", 
      "minuto", 
      "segundo",
      "0-24"
      ],
    
    administrarColumnas: [
      "time",
      "uid",
      "value",
      "metric",
      "typemeter",
      "alias",
      "lat",
      "lon",
      "cota",
      "description",
      "description_origin",
      "name",
      "organizationid",
      "origin",
  ],
  tratamientoDatos: [
      "time",
      "uid",
      "value",
      "metric",
      "typemeter",
      "alias",
      "lat",
      "lon",
      "cota",
      "description",
      "description_origin",
      "name",
      "organizationid",
      "origin",
      "epoch", 
      "dia", 
      "mes", 
      "año", 
      "dia de la semana", 
      "semana",
      "hora", 
      "minuto", 
      "segundo",
      "0-24"
  ],

  per_page: 15,
  per_page_options: [15, 20, 30, 50, 100],
  footer: 'Idryss Kachermi - Smart University'
};
