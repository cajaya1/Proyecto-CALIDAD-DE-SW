const mysql = require('mysql2/promise');
require('dotenv').config();

const imageUrls = {
  1: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/23df2dce-d23e-41e3-bc1a-5e1d0e4e5797/AIR+MAX+90.png',
  2: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_Light_Shoes_White_GY9352_01_standard.jpg',
  3: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/380462/01/sv01/fnd/PNA/fmt/png/RS-X-Efekt-Lux-Sneakers',
  4: 'https://nb.scene7.com/is/image/NB/ml574evn_nb_02_i?$dw_detail_main_lg$&bgc=f5f5f5&layer=1&bgcolor=f5f5f5&blendMode=mult&scale=10&wid=1600&hei=1600'
};

async function updateImages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Conectado a la base de datos');

  // Primero, mostrar productos actuales
  const [products] = await connection.execute('SELECT id, name, image FROM products');
  console.log('\nProductos actuales:');
  console.table(products);

  // Verificar si existe tabla de reviews
  const [tables] = await connection.execute("SHOW TABLES LIKE '%review%'");
  console.log('\nTablas de reviews encontradas:', tables.length);
  
  // Actualizar imágenes
  console.log('\nActualizando imágenes...');
  for (const [id, url] of Object.entries(imageUrls)) {
    await connection.execute(
      'UPDATE products SET image = ? WHERE id = ?',
      [url, id]
    );
    console.log(`✓ Producto ${id} actualizado`);
  }

  // Mostrar productos actualizados
  const [updatedProducts] = await connection.execute('SELECT id, name, image FROM products');
  console.log('\nProductos actualizados:');
  console.table(updatedProducts);

  await connection.end();
  console.log('\n✓ Proceso completado');
}

updateImages().catch(console.error);
