/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/format', 'N/url'],
    function (search, record, format, url) {

        function pageInit(scriptContext) {
            try {
                // document.getElementById("NS_MENU_ID0-item0").style.display = "none";
                var elements = document.getElementsByClassName("ns-menuitem ns-submenu");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.display = "none";
                }
            } catch (e) {
                alert('Error in PageInit ' + e.message);
            }

        }

        function fieldChanged(scriptContext) {
            try {
                var objrec = scriptContext.currentRecord;

                /****Start code for Country in Create Address Form****/

                if (scriptContext.fieldId == 'custfield_country_abbrevation') {
                    var country = objrec.getValue('custfield_country_abbrevation');

                    if (country == '') {
                        var stateAddress = objrec.getField({
                            fieldId: 'custpage_state_abbrevation'
                        });

                        stateAddress.removeSelectOption({
                            value: null,
                        });

                        stateAddress.insertSelectOption({
                            value: '-1',
                            text: ''
                        });

                        stateAddress.insertSelectOption({
                            value: 'Alabama',
                            text: 'Alabama'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Alaska',
                            text: 'Alaska'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Arizona',
                            text: 'Arizona'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Arkansas',
                            text: 'Arkansas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'California',
                            text: 'California'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Colorado',
                            text: 'Colorado'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Connecticut',
                            text: 'Connecticut'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Delaware',
                            text: 'Delaware'
                        });
                        stateAddress.insertSelectOption({
                            value: 'District of Columbia',
                            text: 'District of Columbia'
                        });

                        stateAddress.insertSelectOption({
                            value: 'District of Columbia',
                            text: 'District of Columbia'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Florida',
                            text: 'Florida'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Georgia',
                            text: 'Georgia'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Hawaii',
                            text: 'Hawaii'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Idaho',
                            text: 'Idaho'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Illinois',
                            text: 'Illinois'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Indiana',
                            text: 'Indiana'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Iowa',
                            text: 'Iowa'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Kansas',
                            text: 'Kansas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Kentucky',
                            text: 'Kentucky'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Lousiana',
                            text: 'Lousiana'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Maine',
                            text: 'Maine'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Maryland',
                            text: 'Maryland'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Massachusetts',
                            text: 'Massachusetts'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Michigan',
                            text: 'Michigan'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Minnesota',
                            text: 'Minnesota'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Mississippi',
                            text: 'Mississippi'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Missouri',
                            text: 'Missouri'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Montana',
                            text: 'Montana'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Nebraska',
                            text: 'Nebraska'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Nevada',
                            text: 'Nevada'
                        });
                        stateAddress.insertSelectOption({
                            value: 'New Hampshire',
                            text: 'New Hampshire'
                        });
                        stateAddress.insertSelectOption({
                            value: 'New Jersey',
                            text: 'New Jersey'
                        });
                        stateAddress.insertSelectOption({
                            value: 'New Mexico',
                            text: 'New Mexico'
                        });
                        stateAddress.insertSelectOption({
                            value: 'New York',
                            text: 'New York'
                        });
                        stateAddress.insertSelectOption({
                            value: 'North Carolina',
                            text: 'North Carolina'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Ohio',
                            text: 'Ohio'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Oklahoma',
                            text: 'Oklahoma'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Oregon',
                            text: 'Oregon'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Pennsylvania',
                            text: 'Pennsylvania'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Rhode Island',
                            text: 'Rhode Island'
                        });
                        stateAddress.insertSelectOption({
                            value: 'South Carolina',
                            text: 'South Carolina'
                        });
                        stateAddress.insertSelectOption({
                            value: 'South Dakota',
                            text: 'South Dakota'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Tennessee',
                            text: 'Tennessee'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Texas',
                            text: 'Texas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Utah',
                            text: 'Utah'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Vermont',
                            text: 'Vermont'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Virginia',
                            text: 'Virginia'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Washington',
                            text: 'Washington'
                        });
                        stateAddress.insertSelectOption({
                            value: 'West Virginia',
                            text: 'West Virginia'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Wisconsin',
                            text: 'Wisconsin'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Wyoming',
                            text: 'Wyoming'
                        });

                        var city = objrec.getField({
                            fieldId: 'custfield_city'
                        });
                        var city1 = objrec.setValue('custfield_city', '');
                        city.isDisplay = true;
                        city.isDisabled = false;

                    } else if (country == 'United State') {
                        var stateAddress = objrec.getField({
                            fieldId: 'custpage_state_abbrevation'
                        });

                        stateAddress.removeSelectOption({
                            value: null,
                        });

                        stateAddress.insertSelectOption({
                            value: '-1',
                            text: ''
                        });

                        stateAddress.insertSelectOption({
                            value: 'Alabama',
                            text: 'Alabama'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Alaska',
                            text: 'Alaska'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Arizona',
                            text: 'Arizona'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Arkansas',
                            text: 'Arkansas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'California',
                            text: 'California'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Colorado',
                            text: 'Colorado'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Connecticut',
                            text: 'Connecticut'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Delaware',
                            text: 'Delaware'
                        });
                        stateAddress.insertSelectOption({
                            value: 'District of Columbia',
                            text: 'District of Columbia'
                        });

                        stateAddress.insertSelectOption({
                            value: 'District of Columbia',
                            text: 'District of Columbia'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Florida',
                            text: 'Florida'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Georgia',
                            text: 'Georgia'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Hawaii',
                            text: 'Hawaii'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Idaho',
                            text: 'Idaho'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Illinois',
                            text: 'Illinois'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Indiana',
                            text: 'Indiana'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Iowa',
                            text: 'Iowa'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Kansas',
                            text: 'Kansas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Kentucky',
                            text: 'Kentucky'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Lousiana',
                            text: 'Lousiana'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Maine',
                            text: 'Maine'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Maryland',
                            text: 'Maryland'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Massachusetts',
                            text: 'Massachusetts'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Michigan',
                            text: 'Michigan'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Minnesota',
                            text: 'Minnesota'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Mississippi',
                            text: 'Mississippi'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Missouri',
                            text: 'Missouri'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Montana',
                            text: 'Montana'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Nebraska',
                            text: 'Nebraska'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Nevada',
                            text: 'Nevada'
                        });
                        stateAddress.insertSelectOption({
                            value: 'New Hampshire',
                            text: 'New Hampshire'
                        });
                        stateAddress.insertSelectOption({
                            value: 'New Jersey',
                            text: 'New Jersey'
                        });
                        stateAddress.insertSelectOption({
                            value: 'New Mexico',
                            text: 'New Mexico'
                        });
                        stateAddress.insertSelectOption({
                            value: 'New York',
                            text: 'New York'
                        });
                        stateAddress.insertSelectOption({
                            value: 'North Carolina',
                            text: 'North Carolina'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Ohio',
                            text: 'Ohio'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Oklahoma',
                            text: 'Oklahoma'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Oregon',
                            text: 'Oregon'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Pennsylvania',
                            text: 'Pennsylvania'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Rhode Island',
                            text: 'Rhode Island'
                        });
                        stateAddress.insertSelectOption({
                            value: 'South Carolina',
                            text: 'South Carolina'
                        });
                        stateAddress.insertSelectOption({
                            value: 'South Dakota',
                            text: 'South Dakota'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Tennessee',
                            text: 'Tennessee'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Texas',
                            text: 'Texas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Utah',
                            text: 'Utah'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Vermont',
                            text: 'Vermont'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Virginia',
                            text: 'Virginia'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Washington',
                            text: 'Washington'
                        });
                        stateAddress.insertSelectOption({
                            value: 'West Virginia',
                            text: 'West Virginia'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Wisconsin',
                            text: 'Wisconsin'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Wyoming',
                            text: 'Wyoming'
                        });

                        var city = objrec.getField({
                            fieldId: 'custfield_city'
                        });
                        var city1 = objrec.setValue('custfield_city', '');
                        city.isDisplay = true;
                        city.isDisabled = false;

                    } else if (country == 'Canada') {

                        var stateAddress = objrec.getField({
                            fieldId: 'custpage_state_abbrevation'
                        });

                        stateAddress.removeSelectOption({
                            value: null,
                        });

                        stateAddress.insertSelectOption({
                            value: '-1',
                            text: ''
                        });
                        stateAddress.insertSelectOption({
                            value: 'Alberta',
                            text: 'Alberta'
                        });

                        stateAddress.insertSelectOption({
                            value: 'British Columbia',
                            text: 'British Columbia'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Manitoba',
                            text: 'Manitoba'
                        });
                        stateAddress.insertSelectOption({
                            value: 'New Brunswick',
                            text: 'New Brunswick'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Newfoundland and Labrador',
                            text: 'Newfoundland and Labrador'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Nova Scotia',
                            text: 'Nova Scotia'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Northwest Territories',
                            text: 'Northwest Territories'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Nunavut',
                            text: 'Nunavut'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Ontario',
                            text: 'Ontario'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Prince Edward Island',
                            text: 'Prince Edward Island'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Quebec',
                            text: 'Quebec'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Saskatchewan',
                            text: 'Saskatchewan'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Yukon',
                            text: 'Yukon'
                        });

                        var city = objrec.getField({
                            fieldId: 'custfield_city'
                        });
                        var city1 = objrec.setValue('custfield_city', '');
                        city.isDisplay = true;
                        city.isDisabled = false;
                    } else if (country == 'Mexico') {
                        var stateAddress = objrec.getField({
                            fieldId: 'custpage_state_abbrevation'
                        });

                        stateAddress.removeSelectOption({
                            value: null,
                        });

                        stateAddress.insertSelectOption({
                            value: '-1',
                            text: ''
                        });
                        stateAddress.insertSelectOption({
                            value: 'Aguascalientes',
                            text: 'Aguascalientes'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Baja California',
                            text: 'Baja California'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Baja California Sur',
                            text: 'Baja California Sur'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Campeche',
                            text: 'Campeche'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Chiapas',
                            text: 'Chiapas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Chihuahua',
                            text: 'Chihuahua'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Coahuila',
                            text: 'Coahuila'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Colima',
                            text: 'Colima'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Mexico City',
                            text: 'Mexico City'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Durango',
                            text: 'Durango'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Guanajuato',
                            text: 'Guanajuato'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Guerrero',
                            text: 'Guerrero'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Hidalgo',
                            text: 'Hidalgo'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Jalisco',
                            text: 'Jalisco'
                        });

                        stateAddress.insertSelectOption({
                            value: 'México',
                            text: 'México'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Michoacán',
                            text: 'Michoacán'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Morelos',
                            text: 'Morelos'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Nayarit',
                            text: 'Nayarit'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Nuevo León',
                            text: 'Nuevo León'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Oaxaca',
                            text: 'Oaxaca'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Puebla',
                            text: 'Puebla'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Querétaro',
                            text: 'Querétaro'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Quintana Roo',
                            text: 'Quintana Roo'
                        });

                        stateAddress.insertSelectOption({
                            value: 'San Luis Potosí',
                            text: 'San Luis Potosí'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Sinaloa',
                            text: 'Sinaloa'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Sonora',
                            text: 'Sonora'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Tabasco',
                            text: 'Tabasco'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Tamaulipas',
                            text: 'Tamaulipas'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Tlaxcala',
                            text: 'Tlaxcala'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Veracruz',
                            text: 'Veracruz'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Yucatán',
                            text: 'Yucatán'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Zacatecas',
                            text: 'Zacatecas'
                        });

                        var city = objrec.getField({
                            fieldId: 'custfield_city'
                        });
                        var city1 = objrec.setValue('custfield_city', '');
                        city.isDisplay = true;
                        city.isDisabled = false;
                    } else if (country == 'Puerto Rico') {
                        var stateAddress = objrec.getField({
                            fieldId: 'custpage_state_abbrevation'
                        });

                        stateAddress.removeSelectOption({
                            value: null,
                        });

                        stateAddress.insertSelectOption({
                            value: '-1',
                            text: ''
                        });
                        stateAddress.insertSelectOption({
                            value: 'Adjuntas',
                            text: 'Adjuntas'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Aguada',
                            text: 'Aguada'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Aguadilla',
                            text: 'Aguadilla'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Aguas Buenas',
                            text: 'Aguas Buenas'
                        });

                        stateAddress.insertSelectOption({
                            value: 'Aibonito',
                            text: 'Aibonito'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Añasco',
                            text: 'Añasco'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Arecibo',
                            text: 'Arecibo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Arroyo',
                            text: 'Arroyo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Barceloneta',
                            text: 'Barceloneta'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Barranquitas',
                            text: 'Barranquitas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Bayamón',
                            text: 'Bayamón'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Cabo Rojo',
                            text: 'Cabo Rojo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Caguas',
                            text: 'Caguas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Camuy',
                            text: 'Camuy'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Canóvanas',
                            text: 'Canóvanas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Carolina',
                            text: 'Carolina'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Cataño',
                            text: 'Cataño'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Cayey',
                            text: 'Cayey'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Ceiba',
                            text: 'Ceiba'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Ciales',
                            text: 'Ciales'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Cidra',
                            text: 'Cidra'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Coamo',
                            text: 'Coamo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Comerío',
                            text: 'Comerío'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Corozal',
                            text: 'Corozal'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Culebra',
                            text: 'Culebra'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Dorado',
                            text: 'Dorado'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Fajardo',
                            text: 'Fajardo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Florida',
                            text: 'Florida'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Guánica',
                            text: 'Guánica'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Guayama',
                            text: 'Guayama'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Guayanilla',
                            text: 'Guayanilla'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Guaynabo',
                            text: 'Guaynabo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Gurabo',
                            text: 'Gurabo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Hatillo',
                            text: 'Hatillo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Hormigueros',
                            text: 'Hormigueros'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Humacao',
                            text: 'Humacao'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Isabela',
                            text: 'Isabela'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Jayuya',
                            text: 'Jayuya'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Juana Díaz',
                            text: 'Juana Díaz'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Juncos',
                            text: 'Juncos'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Lajas',
                            text: 'Lajas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Lares',
                            text: 'Lares'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Las Marías',
                            text: 'Las Marías'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Las Piedras',
                            text: 'Las Piedras'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Loíza',
                            text: 'Loíza'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Luquillo',
                            text: 'Luquillo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Manatí',
                            text: 'Manatí'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Maricao',
                            text: 'Maricao'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Maunabo',
                            text: 'Maunabo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Mayagüez',
                            text: 'Mayagüez'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Moca',
                            text: 'Moca'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Morovis',
                            text: 'Morovis'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Naguabo',
                            text: 'Naguabo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Naranjito',
                            text: 'Naranjito'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Orocovis',
                            text: 'Orocovis'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Patillas',
                            text: 'Patillas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Peñuelas',
                            text: 'Peñuelas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Ponce',
                            text: 'Ponce'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Quebradillas',
                            text: 'Quebradillas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Rincón',
                            text: 'Rincón'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Río Grande',
                            text: 'Río Grande'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Sabana Grande',
                            text: 'Sabana Grande'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Salinas',
                            text: 'Salinas'
                        });
                        stateAddress.insertSelectOption({
                            value: 'San Germán',
                            text: 'San Germán'
                        });
                        stateAddress.insertSelectOption({
                            value: 'San Juan',
                            text: 'San Juan'
                        });
                        stateAddress.insertSelectOption({
                            value: 'San Lorenzo',
                            text: 'San Lorenzo'
                        });
                        stateAddress.insertSelectOption({
                            value: 'San Sebastián',
                            text: 'San Sebastián'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Santa Isabel',
                            text: 'Santa Isabel'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Toa Alta',
                            text: 'Toa Alta'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Toa Baja',
                            text: 'Toa Baja'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Trujillo Alto',
                            text: 'Trujillo Alto'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Utuado',
                            text: 'Utuado'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Vega Alta',
                            text: 'Vega Alta'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Vega Baja',
                            text: 'Vega Baja'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Vieques',
                            text: 'Vieques'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Villalba',
                            text: 'Villalba'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Yabucoa',
                            text: 'Yabucoa'
                        });
                        stateAddress.insertSelectOption({
                            value: 'Yauco',
                            text: 'Yauco'
                        });

                        var city = objrec.getField({
                            fieldId: 'custfield_city'
                        });
                        var city1 = objrec.setValue('custfield_city', '0');

                        city.isDisabled = true;
                        city.isDisplay = false;
                    }
                }

                /****End code for Country in Create Address Form****/

                /****Start code for Phone Validation in Create Address Form****/
                var phone = objrec.getValue({
                    fieldId: 'custfield_phone'
                });
                var count = 0;

                if (phone >= 1) ++count;

                while (phone / 10 >= 1) {
                    phone /= 10;
                    ++count;
                }

                if (scriptContext.fieldId == 'custfield_phone' && objrec.getValue('custfield_phone')) {

                    if (count > 10 || count <= 9) {
                        alert('Please Enter Valid Phone Number');
                        objrec.setValue('custfield_phone', "");
                    }
                }
                /****END code for Phone Validation in Create Address Form****/

            } catch (e) {
                alert('Error in fieldchanged ' + e.message);
            }
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged

        };
    });