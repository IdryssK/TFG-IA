export const environment = {
    production: true,
    apiUrl: 'http://localhost:3000/api',
    filters: [
        "uid",
        "description_origin",
        "lat",
        "lon",
        "organizationid",
        "alias",
        "cota",
        "description",
        "metric",
        "name",
        "origin",
        "typemeter"
      ],
    tiposFechas: ["epoch", 
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
};
