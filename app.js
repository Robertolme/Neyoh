const express = require('express');
const app = express();
const port = 3000; // Puedes cambiar el puerto si lo deseas
const excel = require('exceljs'); // Mover esta línea aquí

app.get('/', (req, res) => {
  const workbook = new excel.Workbook();
  workbook.xlsx.readFile('lista_precios.xlsx')
    .then(() => {
      const worksheet = workbook.getWorksheet(1);

      // Generar el HTML con los datos del archivo Excel en una tabla
      let html = '<html><head><style>';
      html += 'body { text-align: center; background-image: url("fondo.jpeg"); background-size: cover; background-attachment: fixed; }';
      html += 'table { width: 80%; border-collapse: collapse; margin: 20px auto; border: 1px solid #000; }';
      html += 'th, td { text-align: center; padding: 10px; font-size: 20px; }';
      html += 'th { background-color: #f2f2f2; }';
      html += 'td { border-bottom: 1px solid blue; }';
      html += 'tr:nth-child(odd) { background-color: rgba(0, 0, 0, 0.05); }'; // Estilo para filas impares
      html += '.divider { border-left: 1px solid blue; }';
      html += '.search-container { margin-top: 20px; margin-bottom: 20px; }';
      html += '#searchInput { width: 800px; padding: 15px; font-size: 24px; }';
      html += '</style></head><body>';
      html += '<div class="search-container">';
      html += '<img src="logo.png" style="float: left; margin-right: 20px; width: 100px;">';
      html += '<input type="text" id="searchInput" placeholder="Buscar artículo">';
      html += '</div>';
      html += '<table id="priceList">';
      html += '<tr>';
      html += '<th style="width: 70%;">Artículo</th>';
      html += '<th class="divider"></th>';
      html += '<th style="width: 30%;">Precio</th>';
      html += '</tr>';

      worksheet.eachRow((row, rowNumber) => {
        const item = row.getCell(1).value;
        const price = row.getCell(2).value;
        html += '<tr>';
        html += `<td>${item}</td>`;
        html += '<td class="divider"></td>';
        html += `<td>$${price}</td>`;
        html += '</tr>';
      });

      html += '</table></body></html>';
      html += '<script>';
      html += 'document.getElementById("searchInput").addEventListener("keyup", function() {';
      html += '  const inputText = this.value.toLowerCase();';
      html += '  const table = document.getElementById("priceList");';
      html += '  const rows = table.getElementsByTagName("tr");';
      html += '  for (let i = 1; i < rows.length; i++) {';
      html += '    const row = rows[i];';
      html += '    const item = row.getElementsByTagName("td")[0].textContent.toLowerCase();';
      html += '    if (item.indexOf(inputText) > -1) {';
      html += '      row.style.display = "";';
      html += '    } else {';
      html += '      row.style.display = "none";';
      html += '    }';
      html += '  }';
      html += '});';
      html += '</script>';

      res.send(html);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error al procesar el archivo Excel');
    });
});


app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});
