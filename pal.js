/**

Supplementary protection certificate calculator

Author Vincas Batulevičius (  vincasbat@gmail.com  )

*/


export default class Pal extends HTMLElement {

    constructor() {
        super();

        let template = `
<table>
    <tr style="font-weight: bold;">
        <td>PAL skaičiuoklė</td>
        <td></td>
    </tr>
    <tr>
        <td>Patento Nr.</td>
        <td> <input type="text" id="patnr" size="30" value="" placeholder=""></td>
    </tr>
    <tr>
        <td>Patento paraiškos padavimo data (A)</td>
        <td> <input type="text" id="a" size="30" value="1993-06-25" required></td>
    </tr>
    <tr>
        <td>Leidimo pateikti produktą į rinką data (B) </td>
        <td><input type="text" id="b" size="30" value="2008-07-13" required></td>
    </tr>
    <tr>
        <td>Patento galiojimo pabaigos data (C)</td>
        <td> <input type="text" id="c" size="30" value="2013-06-25" required></td>
    </tr>

    <tr>
        <td>PAL galiojimo terminas (D) </td>
        <td><input type="text" id="d" size="30"></td>
    </tr>
    <tr>
        <td>PAL galiojimo pabaigos data (L) </td>
        <td><input type="text" id="l" size="30"> </td>
    </tr>
    <tr>
        <td colspan="2">D = B - A - 5 (metai), kai (B - A - 5 metai) > 0; L = C + D, kai L &lt;= 15 (metų)</td>
    </tr>

    <tr>
        <td style="background-image:url('vincasoft5.png');padding-right:10px;background-repeat: no-repeat;background-position: left;">


        </td>
        <td style="text-align: right;"><button id="sk" type="button" class="button">Skaičiuoti</button> &nbsp; <button id="tr" type="button" class="button">Trinti</button> </td>
    </tr>


</table>
<style>
    table {
        background-color: #F9F9FC;
        /* #f0f5f5; */
        border: 0px;
        font-family: Arial, Sans-serif;
    }

    input[type=text] {
        background: #F9F9FC;
        /*#F9F9FC;*/
        border: 1px solid grey;
        border-radius: 4px;
        padding-left: 5px;
    }

    input[type=text]:focus {
        background-color: white;
    }

    #d,
    #l {
        font-weight: bold;
    }

    button {
        border-radius: 4px;
    }
</style>

`;


        this.innerHTML = template;




    }




    connectedCallback() {

        // adding event handler to the button
        this.querySelector('#sk')
            .addEventListener('click', this.skaiciuoti.bind(this));

        this.querySelector('#tr')
            .addEventListener('click', this.valyti2.bind(this));

        this.querySelector('#a')
            .addEventListener('change', this.valyti.bind(this));

        this.querySelector('#a').addEventListener('change', this.pat_gal_pabaiga.bind(this));

        this.querySelector('#b')
            .addEventListener('change', this.valyti.bind(this));

        this.querySelector('#c')
            .addEventListener('change', this.valyti.bind(this));

        this.querySelector('#patnr')
            .addEventListener('change', this.valyti.bind(this));
    }


    disconnectedCallback() {

        this.querySelector('#sk').removeEventListener('click', this.skaiciuoti.bind(this));

        this.querySelector('#tr').removeEventListener('click', this.valyti2.bind(this));

        this.querySelector('#a').removeEventListener('change', this.valyti.bind(this));

        this.querySelector('#a').removeEventListener('change', this.pat_gal_pabaiga.bind(this));

        this.querySelector('#b').removeEventListener('change', this.valyti.bind(this));

        this.querySelector('#c').removeEventListener('change', this.valyti.bind(this));

        this.querySelector('#patnr').removeEventListener('change', this.valyti.bind(this));

    }




    DateDiff(b, e) {
        var endYear = e.getFullYear();
        var endMonth = e.getMonth();
        var years = endYear - b.getFullYear();
        var months = endMonth - b.getMonth();
        var days = e.getDate() - b.getDate();
        if (months < 0) {
            years--;
            months += 12;
        }
        if (days < 0) {
            if (months == 0) {
                years--;
                months += 11;
            } else {
                months--;
            }
            days += new Date(endYear, endMonth, 0).getDate();
        }
        return [years, months, days];
    }
    skaiciuoti() {
        var B = document.getElementById("b").value.trim();
        var A = document.getElementById("a").value.trim();
        var C = document.getElementById("c").value.trim();
        var L = new Date();
        if (B < A) {
            alert("B < A!");
            return;
        }
        var Bdata = new Date(B);
        var Adata = new Date(A);
        var Cdata = new Date(C);
        if (!this.isDate(Bdata)) {
            alert("Neteisinga B data!");
            document.getElementById("b").focus();
            return;
        }
        if (!this.isDate(Adata)) {
            alert("Neteisinga A data!");
            document.getElementById("a").focus();
            return;
        }
        if (!this.isDate(Cdata)) {
            alert("Neteisinga C data!");
            document.getElementById("c").focus();
            return;
        }
        var diff = this.DateDiff(Adata, Bdata);
        var metusk = diff[0];
        var mensk = diff[1];
        var dsk = diff[2];
        var metusk_5 = metusk - 5;
        if (metusk_5 < 0) {
            alert("B - A - 5 < 0!");
            return;
        }
        var dtext;
        if (metusk_5 >= 5) {
            dtext = "5 m. 0 mėn. 0 d.";
            L = new Date(Cdata);
            L.setFullYear(L.getFullYear() + 5);
        } else {
            dtext = metusk_5 + " m. " + mensk + " mėn. " + dsk + " d.";
            L = new Date(Cdata);
            L.setFullYear(L.getFullYear() + metusk_5);
            L.setMonth(L.getMonth() + mensk);
            L.setDate(L.getDate() + dsk);
        }

        var b15 = new Date(Cdata);
        b15.setFullYear(b15.getFullYear() + 15);
        if (L <= b15) {} else L = b15;
        var Ltext = L.toISOString().slice(0, 10);
        document.getElementById("d").value = dtext;
        document.getElementById("l").value = Ltext;
        alert("Suskaičiuota!");
    }
    pat_gal_pabaiga() {
        var aDate = new Date(document.getElementById("a").value);
        if (this.isDate(aDate)) {
            aDate.setFullYear(aDate.getFullYear() + 30);
            document.getElementById("c").value = aDate.toISOString().slice(0, 10);
        }
    }
    valyti() {
        document.getElementById("d").value = "";
        document.getElementById("l").value = "";
    }
    valyti2() {
        document.getElementById("d").value = "";
        document.getElementById("l").value = "";
        document.getElementById("a").value = "";
        document.getElementById("b").value = "";
        document.getElementById("c").value = "";
        document.getElementById("patnr").value = "";
    }
    isDate(x) {
        return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate);
    }
}
