export function drawTableHeader(doc: PDFKit.PDFDocument, y: number) {
  row(doc, y);
  textInCell(doc, 'No.', 30, y);
  textInCell(doc, 'Product', 70, y);
  textInCell(doc, 'Qty', 270, y);
  textInCell(doc, 'Price', 330, y);
  textInCell(doc, 'Total', 420, y);
}

export function drawOrderRow(doc: PDFKit.PDFDocument, item: any, index: number, y: number) {
  row(doc, y);

  const title = item.productId?.title || 'Unknown Product';
  const qty = item.quantity;
  const price = item.productId?.price || 0;
  const total = qty * price;

  textInCell(doc, `${index + 1}`, 30, y);
  textInCell(doc, title, 70, y, 180);
  textInCell(doc, `${qty}`, 270, y);
  textInCell(doc, `$${price.toFixed(2)}`, 330, y);
  textInCell(doc, `$${total.toFixed(2)}`, 420, y);

  return total;
}

export function row(doc: PDFKit.PDFDocument, y: number) {
  doc.lineJoin('miter').rect(30, y, 500, 20).stroke();
}

export function textInCell(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  width: number = 80,
) {
  doc
    .fontSize(10)
    .fillColor('black')
    .text(text, x + 5, y + 5, {
      width: width - 10,
      height: 20,
      align: 'left',
    });
}
