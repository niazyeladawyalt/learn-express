import { Request, Response, NextFunction } from 'express';
import Order from '../models/order';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import PDFDocument from 'pdfkit';
import { drawOrderRow, drawTableHeader, row, textInCell } from '../util/pdf-kit';

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('items.productId');

    const formattedOrders = orders.map((order) => {
      const totalPrice = order.items.reduce((sum, item: any) => {
        const price = item.productId?.price || 0;
        return sum + price * item.quantity;
      }, 0);

      return {
        ...order.toObject(),
        formattedDate: format(order.createdAt, 'd MMMM yyyy'),
        totalPrice,
      };
    });

    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    next(error);
  }
};
const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderItems = req.user.cart.items;
    const order = new Order({
      items: orderItems,
      userId: req.user._id,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
  } catch (error) {
    console.error('Failed to place order:', error);
    res.status(500).send('Something went wrong while placing your order.');
  }
};

const getInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { orderId } = req.params;
  const invoiceName = 'invoice-' + orderId + '.pdf';
  const invoicePath = path.join('src/data', 'invoices', invoiceName);
  try {
    const foundOrder = await Order.findById(orderId).populate('items.productId');

    if (!foundOrder) {
      res.status(404).send('Order not found.');
      return;
    }

    if (req.user._id.toString() !== foundOrder.userId?.toString()) {
      res.status(403).send('Unauthorized');
      return;
    }

    // const file = fs.createReadStream(invoicePath);
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`);

    // Create and pipe the PDF directly to response
    doc.pipe(fs.createWriteStream(invoicePath));
    doc.pipe(res);

    doc.fontSize(18).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.text(`Order ID: ${orderId}`);
    doc.text(`User ID: ${foundOrder.userId}`);
    doc.text(`Created At: ${foundOrder.createdAt.toDateString()}`);

    // Add more detailed invoice lines if needed
    let y = 230;
    drawTableHeader(doc, y);
    y += 20;

    let totalAmount = 0;

    foundOrder.items.forEach((item: any, index: number) => {
      totalAmount += drawOrderRow(doc, item, index, y);
      y += 20;
    });

    // Draw total row
    row(doc, y);
    textInCell(doc, 'Total', 330, y);
    textInCell(doc, `$${totalAmount.toFixed(2)}`, 420, y);

    doc.end(); // Finalize PDF
  } catch (error) {}
};

export { getOrders, postOrder, getInvoice };
