const client = require("./index");

async function createOrder({ userId, productId, isPurchased }) {
  try {
    const {
      rows: [CreatedOrder],
    } = await client.query(
      `
      INSERT INTO orders ("userId", "productId", "isPurchased")
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [userId, productId, isPurchased]
    );

    return CreatedOrder;
  } catch (error) {
    throw error;
  }
}

async function getAllOrders() {
  const { rows: orders } = await client.query(`
      SELECT orders.*, users.email FROM orders
      JOIN users ON users.id = orders."userId";
      `);

  for (const order of orders) {
    const { rows: products } = await client.query(
      `
    SELECT products.*,
    order_products.id AS "orderProductId",
    order_products.count FROM products
    JOIN order_products ON products.id = order_products."productId"
    WHERE order_products."orderId" = $1;
    `,
      [order.id]
    );
    order.products = products;
  }
  //   console.log(orders);
  return orders;
}

async function getOrdersByUser(id) {
  try {
    const output = await getAllOrders();
    console.log(output);
    const orders = output.filter((order) => order.userId === id);

    return orders;
  } catch (error) {
    throw error;
  }
}
//   try {
//     const { rows } = await client.query(
//       `
//       SELECT orders.*
//       FROM orders
//       JOIN users ON users.id = orders."userId"
//       WHERE email = $1`,
//       [email]
//     );
//     for (const order of rows) {
//       const { rows: products } = await client.query(
//         `
//         SELECT products.*, order_products.id AS order_productId
//         FROM products
//         JOIN order_products ON order_products."productId" = product.id
//         WHERE order_products."orderId" = $1`,
//         [order.id]
//       );
//       order.products = products;
//     }
//     return rows;
// async function getOrdersByUser({ userId }) {
//   try {
//     const { rows } = await client.query(
//       `
//       SELECT *
//       FROM orders
//       WHERE "userId" = $1`,
//       [userId]
//     );
//     for (const order of rows) {
//       const { rows: products } = await client.query(
//         `
//         SELECT products.*, orders_products.id AS "order_productId"
//         FROM products
//         JOIN orders_products ON orders_products."productId" = product.id
//         WHERE orders_products."orderId" = $1`,
//         [order.id]
//       );
//       order.products = products;
//     }
//     return rows;
//   } catch (error) {
//     throw error;
//   }
// }

async function getOrderById(id) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
      SELECT *
      FROM orders
      WHERE id=$1;
        `,
      [id]
    );
    return order;
  } catch (error) {
    throw error;
  }
}

//getUserIdbyOrderId
// const getUser

async function updateOrder({ id, count }) {
  try {
    if (count) {
      await client.query(
        `UPDATE order_products SET count = $1 WHERE id = $2 RETURNING *;`,
        [count, id]
      );
    }
    const order = getOrderById(id);
    return order;
  } catch (error) {
    throw error;
  }
}

async function destroyOrder(id) {
  try {
    await client.query(
      `
          DELETE FROM order_products 
          WHERE "orderId" = $1;
      `,
      [id]
    );
    const {
      rows: [order],
    } = await client.query(
      `
          DELETE FROM orders 
          WHERE id = $1
          RETURNING *
      `,
      [id]
    );
    return order;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrder,
  destroyOrder,
  getAllOrders,
};
