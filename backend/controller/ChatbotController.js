const Chatbot = require('../model/Chatbot');

class ChatbotController {
  // Crear un nuevo mensaje de chat
  static async createMessage(req, res) {
    try {
      const { userId, userMessage } = req.body;

      if (!userMessage || userMessage.trim() === '') {
        return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
      }

      // Generar respuesta del chatbot (lógica simple)
      const botResponse = ChatbotController.generateResponse(userMessage);
      const intent = ChatbotController.detectIntent(userMessage);

      const chatMessage = await Chatbot.create({
        userId: userId || null,
        userMessage,
        botResponse,
        intent,
        resolved: false
      });

      res.status(201).json({
        success: true,
        message: 'Mensaje enviado correctamente',
        data: chatMessage
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al procesar el mensaje',
        details: error.message
      });
    }
  }

  // Obtener historial de chat del usuario
  static async getChatHistory(req, res) {
    try {
      const { userId } = req.params;

      const messages = await Chatbot.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 50
      });

      res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener historial de chat',
        details: error.message
      });
    }
  }

  // Obtener todos los mensajes (solo admin)
  static async getAllMessages(req, res) {
    try {
      const messages = await Chatbot.findAll({
        order: [['createdAt', 'DESC']],
        limit: 100
      });

      res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener mensajes',
        details: error.message
      });
    }
  }

  // Marcar mensaje como resuelto
  static async markAsResolved(req, res) {
    try {
      const { chatId } = req.params;

      const chatMessage = await Chatbot.findByPk(chatId);
      if (!chatMessage) {
        return res.status(404).json({ error: 'Mensaje no encontrado' });
      }

      const updatedMessage = await Chatbot.update(chatId, { resolved: true });

      res.status(200).json({
        success: true,
        message: 'Mensaje marcado como resuelto',
        data: updatedMessage
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al actualizar mensaje',
        details: error.message
      });
    }
  }

  // Obtener estadísticas de chat
  static async getChatStats(req, res) {
    try {
      const totalMessages = await Chatbot.count();
      const resolvedMessages = await Chatbot.count({ where: { resolved: true } });
      const intents = await Chatbot.findAll({
        attributes: ['intent'],
        raw: true
      });

      // Contar intents
      const intentCounts = {};
      intents.forEach(msg => {
        intentCounts[msg.intent] = (intentCounts[msg.intent] || 0) + 1;
      });

      res.status(200).json({
        success: true,
        stats: {
          totalMessages,
          resolvedMessages,
          resolutionRate: `${((resolvedMessages / totalMessages) * 100 || 0).toFixed(2)}%`,
          intentDistribution: intentCounts
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener estadísticas',
        details: error.message
      });
    }
  }

  // Métodos auxiliares para generar respuestas mejoradas con IA conversacional
  static generateResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();

    // Saludos y cortesía
    if (this.matchesAny(message, ['hola', 'hi', 'hello', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'que tal'])) {
      return '¡Hola! 👋 Bienvenido a Sneakers Store. Soy tu asistente virtual y estoy aquí para ayudarte. Puedo asesorarte sobre:\n\n🔹 Productos y catálogo\n🔹 Precios y ofertas\n🔹 Envíos y entregas\n🔹 Cambios y devoluciones\n🔹 Métodos de pago\n🔹 Seguimiento de pedidos\n\n¿En qué puedo ayudarte hoy?';
    }

    // Agradecimientos
    if (this.matchesAny(message, ['gracias', 'thanks', 'thank you', 'muchas gracias', 'perfecto', 'genial', 'excelente', 'ok'])) {
      return '¡De nada! 😊 Estoy aquí para ayudarte siempre que lo necesites. ¿Hay algo más en lo que pueda asistirte?';
    }

    // Despedidas
    if (this.matchesAny(message, ['adios', 'adiós', 'chau', 'bye', 'hasta luego', 'nos vemos', 'me voy'])) {
      return '¡Hasta pronto! 👋 Gracias por visitar Sneakers Store. Que tengas un excelente día. Estamos aquí cuando nos necesites. 😊';
    }

    // Precios y costos
    if (this.matchesAny(message, ['precio', 'costo', 'valor', 'cuánto', 'cuanto', '$$', 'barato', 'caro', 'oferta', 'descuento', 'promoción'])) {
      return '💰 **Nuestros Precios:**\n\n📌 Nike Air Max 90: $129.99\n📌 Adidas Ultraboost: $179.99 (Premium)\n📌 Puma RS-X: $99.99 (¡Oferta!)\n📌 New Balance 574: $89.99 (Mejor precio)\n\n🎉 **Promociones activas:**\n• 15% OFF en segunda compra\n• Envío gratis en compras +$150\n• 3 cuotas sin interés\n\n¿Te interesa algún modelo en particular?';
    }

    // Envíos y entregas
    if (this.matchesAny(message, ['envío', 'envio', 'entrega', 'shipping', 'delivery', 'cuando llega', 'cuanto tarda', 'demora'])) {
      return '📦 **Información de Envíos:**\n\n🚚 **Tiempos de entrega:**\n• Capital Federal: 24-48 hs\n• GBA: 2-3 días hábiles\n• Interior: 3-5 días hábiles\n• Patagonia: 5-7 días hábiles\n\n💵 **Costos:**\n• CABA: $5 (GRATIS +$150)\n• GBA: $8\n• Interior: $10-15\n\n📍 Podés seguir tu pedido en tiempo real con el código de seguimiento. ¿Necesitas más detalles sobre alguna zona específica?';
    }

    // Cambios y tallas
    if (this.matchesAny(message, ['cambio', 'cambiar', 'talla', 'talle', 'número', 'numero', 'medida', 'me queda', 'grande', 'chico', 'pequeño'])) {
      return '👟 **Cambios y Tallas:**\n\n📏 **Guía de tallas disponible:**\n• Sistemas: US, EU, UK, CM\n• Calculadora de talla en el sitio\n• Medidas exactas por modelo\n\n🔄 **Política de cambios:**\n• Hasta 30 días desde la compra\n• Producto sin uso y con etiquetas\n• Primer cambio SIN COSTO\n• Recolección a domicilio disponible\n\n¿Necesitas ayuda para elegir tu talla correcta?';
    }

    // Devoluciones y reembolsos
    if (this.matchesAny(message, ['devolución', 'devolucion', 'reembolso', 'devolver', 'return', 'me arrepentí', 'no me gustó', 'cancelar'])) {
      return '↩️ **Política de Devoluciones:**\n\n✅ **Condiciones:**\n• 30 días corridos desde la compra\n• Producto sin uso y embalaje original\n• Factura de compra incluida\n\n💳 **Reembolsos:**\n• Mismo medio de pago original\n• Acreditación: 5-10 días hábiles\n• Sin comisiones ni gastos extras\n\n📝 **Proceso:**\n1. Solicitá devolución desde tu cuenta\n2. Generamos la etiqueta de envío\n3. Despachás el producto\n4. Verificamos y procesamos reembolso\n\n¿Hay algún problema con tu compra?';
    }

    // Métodos de pago
    if (this.matchesAny(message, ['pago', 'pagar', 'tarjeta', 'efectivo', 'transferencia', 'mercado pago', 'cuotas', 'financiación', 'financiacion'])) {
      return '💳 **Métodos de Pago Disponibles:**\n\n✨ **Tarjetas de crédito:**\n• Visa, Mastercard, American Express\n• Hasta 12 cuotas sin interés\n• 3 cuotas SIN INTERÉS en compras +$100\n\n💵 **Otros medios:**\n• Débito (un solo pago)\n• Mercado Pago\n• Transferencia bancaria (5% descuento)\n• Efectivo en sucursal\n\n🔒 Pagos 100% seguros con encriptación SSL. ¿Querés proceder con tu compra?';
    }

    // Marcas específicas
    if (this.matchesAny(message, ['nike', 'air max', 'jordan'])) {
      return '👟 **Nike - Just Do It:**\n\n⭐ Modelos disponibles:\n• Nike Air Max 90 - $129.99\n  - Clásico atemporal\n  - Amortiguación Air visible\n  - Disponible en 5 colores\n\n• Nike Air Force 1 - $119.99\n• Nike Pegasus - $139.99\n• Nike Cortez - $99.99\n\n✅ Stock disponible | Envío gratis +$150\n\n¿Te gustaría ver más detalles de algún modelo?';
    }

    if (this.matchesAny(message, ['adidas', 'ultraboost', 'superstar', 'stan smith'])) {
      return '⚡ **Adidas - Impossible Is Nothing:**\n\n⭐ Colección destacada:\n• Adidas Ultraboost - $179.99 ⭐ Premium\n  - Tecnología BOOST\n  - Máxima comodidad\n  - Running profesional\n\n• Adidas Superstar - $109.99\n• Stan Smith - $99.99\n• Forum Low - $119.99\n\n✅ Modelos icónicos | Todas las tallas\n\n¿Cuál te interesa más?';
    }

    if (this.matchesAny(message, ['puma', 'rs-x', 'suede'])) {
      return '🐆 **Puma - Forever Faster:**\n\n⭐ Estilo urbano:\n• Puma RS-X - $99.99 🔥 ¡OFERTA!\n  - Diseño retro-futurista\n  - Suela chunky\n  - Edición limitada\n\n• Puma Suede Classic - $89.99\n• Puma Clyde - $109.99\n\n✅ Tendencia actual | Descuentos especiales\n\n¿Quieres agregar alguno al carrito?';
    }

    if (this.matchesAny(message, ['new balance', 'nb', '574', '990'])) {
      return '🔵 **New Balance - Fearlessly Independent:**\n\n⭐ Comodidad premium:\n• New Balance 574 - $89.99 💎 BEST PRICE\n  - Clásico versátil\n  - Ideal uso diario\n  - Excelente relación calidad-precio\n\n• NB 990v5 - $169.99\n• NB 327 - $119.99\n\n✅ Made with quality | Stock completo\n\n¿Te ayudo con tu talla?';
    }

    // Productos y catálogo
    if (this.matchesAny(message, ['productos', 'zapatillas', 'sneakers', 'shoes', 'catálogo', 'catalogo', 'modelos', 'qué tienen', 'que tienen', 'mostrame'])) {
      return '🏪 **Nuestro Catálogo Premium:**\n\n🏆 **Marcas disponibles:**\n✔️ Nike - Innovación y estilo\n✔️ Adidas - Performance y diseño\n✔️ Puma - Actitud urbana\n✔️ New Balance - Comodidad superior\n\n📂 **Categorías:**\n🏃 Running & Training\n👟 Lifestyle & Casual\n⚡ Limited Editions\n🎨 Colorways exclusivos\n\n💫 **Lo más vendido esta semana:**\n1️⃣ Nike Air Max 90\n2️⃣ Adidas Ultraboost\n3️⃣ Puma RS-X\n\n¿Qué estilo buscas?';
    }

    // Pedidos y seguimiento
    if (this.matchesAny(message, ['pedido', 'orden', 'compra', 'seguimiento', 'rastreo', 'track', 'dónde está', 'donde esta', 'estado'])) {
      return '📋 **Seguimiento de Pedidos:**\n\n🔍 Para rastrear tu compra necesito:\n• Número de pedido (ej: #12345)\n• Email de compra\n\nPodés consultar el estado desde:\n✅ "Mi Cuenta" → "Mis Pedidos"\n✅ Link en el email de confirmación\n✅ WhatsApp: compartí tu número de orden\n\n📊 **Estados posibles:**\n🟡 Procesando\n🔵 En preparación  \n🟢 En camino\n✅ Entregado\n\n¿Tenés el número de tu pedido?';
    }

    // Stock y disponibilidad
    if (this.matchesAny(message, ['stock', 'disponible', 'disponibilidad', 'hay', 'tienen', 'quedó', 'quedo', 'agotado'])) {
      return '📦 **Consulta de Stock:**\n\n✅ Todos nuestros productos tienen:\n• Actualización en tiempo real\n• Indicador de disponibilidad\n• Alerta de últimas unidades\n\n💡 **Sugerencia:**\n• Revisá la página del producto específico\n• Si dice "Agregar al carrito" → HAY STOCK ✅\n• Si dice "Avisarme" → Sin stock temporalmente\n\n🔔 Podemos notificarte cuando vuelva el producto que buscas. ¿Cuál modelo te interesa?';
    }

    // Cuenta y registro
    if (this.matchesAny(message, ['cuenta', 'registrar', 'registro', 'crear cuenta', 'login', 'contraseña', 'password', 'olvidé'])) {
      return '👤 **Gestión de Cuenta:**\n\n📝 **Crear cuenta:**\n• Proceso rápido (2 minutos)\n• Beneficios exclusivos\n• Historial de compras\n• Wishlist y favoritos\n\n🔑 **Problemas de acceso:**\n• ¿Olvidaste tu contraseña? → "Recuperar contraseña"\n• Email de verificación en spam?\n• Soporte directo: soporte@sneakers.com\n\n🎁 **Beneficios de registrarte:**\n✨ 10% OFF en primera compra\n✨ Envío express disponible\n✨ Acceso a preventas\n\n¿Necesitas ayuda para crear tu cuenta?';
    }

    // Atención y horarios
    if (this.matchesAny(message, ['horario', 'atención', 'atencion', 'abierto', 'cerrado', 'hora', 'cuando atienden'])) {
      return '🕒 **Horarios de Atención:**\n\n📅 **Tienda Online:**\n• Disponible 24/7 🌐\n• Compra cuando quieras\n\n💬 **Soporte al Cliente:**\n• Lun-Vie: 9:00 - 18:00 hs\n• Sábados: 9:00 - 14:00 hs\n• Domingos: cerrado\n\n📞 **Canales de contacto:**\n• Chat (aquí): 24/7\n• WhatsApp: horario comercial\n• Email: respuesta en 24 hs\n\n🏬 **Tienda física:**\n• Lun-Sáb: 10:00 - 20:00 hs\n\n¿Necesitas hablar con un agente humano?';
    }

    // Calidad y garantía
    if (this.matchesAny(message, ['calidad', 'garantía', 'garantia', 'original', 'auténtico', 'fake', 'verdadero', 'legítimo'])) {
      return '✅ **Garantía de Autenticidad:**\n\n🔐 **100% PRODUCTOS ORIGINALES**\n• Distribuidores oficiales\n• Certificados de autenticidad\n• Garantía del fabricante\n\n🛡️ **Nuestra garantía:**\n• 90 días contra defectos de fábrica\n• Inspección pre-envío\n• Embalaje original sellado\n• Factura oficial\n\n⚠️ **Cuidado con imitaciones:**\nComprá seguro en tiendas autorizadas como nosotros.\n\n💎 Cada producto incluye:\n✔️ Etiquetas originales\n✔️ Caja oficial\n✔️ Documentación de marca\n\n¿Alguna duda sobre autenticidad?';
    }

    // Carrito y compra
    if (this.matchesAny(message, ['carrito', 'comprar', 'agregar', 'añadir', 'checkout', 'proceder', 'finalizar compra'])) {
      return '🛒 **Proceso de Compra:**\n\n📝 **Pasos simples:**\n1️⃣ Agregá productos al carrito\n2️⃣ Revisá tu pedido\n3️⃣ Completá datos de envío\n4️⃣ Elegí método de pago\n5️⃣ ¡Confirmá y listo!\n\n💡 **Tips útiles:**\n• Guardá productos para después\n• Aplicá cupones de descuento\n• Calculá envío antes de pagar\n\n🎁 **Envío GRATIS en compras +$150**\n\n¿Ya elegiste qué comprar o necesitas recomendaciones?';
    }

    // Opiniones y reviews
    if (this.matchesAny(message, ['opinión', 'opinion', 'review', 'reseña', 'resena', 'comentario', 'calificación', 'calificacion', 'estrella'])) {
      return '⭐ **Opiniones de Clientes:**\n\n📊 **Nuestras calificaciones:**\n• Promedio general: 4.8/5 ⭐⭐⭐⭐⭐\n• +2,500 reseñas verificadas\n• 95% recomienda nuestros productos\n\n💬 **Cada producto incluye:**\n✔️ Reviews de compradores reales\n✔️ Fotos de clientes\n✔️ Calificaciones por talla y comodidad\n\n📝 **Dejá tu opinión:**\n• Comprá → Recibí el producto → Calificá\n• Ganás puntos por cada review\n• Ayudás a otros compradores\n\n¿Querés ver opiniones de algún modelo específico?';
    }

    // Ayuda general o problemas
    if (this.matchesAny(message, ['ayuda', 'help', 'problema', 'error', 'no funciona', 'no puedo', 'falla', 'bug'])) {
      return '🆘 **Centro de Ayuda:**\n\n¿Qué tipo de problema tenés?\n\n🔹 **Navegación del sitio**\n• Reiniciá la página\n• Limpiá caché del navegador\n• Probá con otro navegador\n\n🔹 **Problemas de pago**\n• Verificá datos de tarjeta\n• Comprobá límites de compra\n• Intentá otro medio de pago\n\n🔹 **Problemas de cuenta**\n• Recuperá contraseña\n• Verificá email de confirmación\n\n🔹 **Otros problemas**\n📞 WhatsApp: +54 9 11 XXXX-XXXX\n📧 soporte@sneakers.com\n\nDescribime tu problema específico y te ayudo a resolverlo.';
    }

    // Respuesta por defecto mejorada con opciones claras
    return '🤖 **Asistente Virtual Sneakers Store**\n\n¡Hola! No estoy seguro de entender tu consulta, pero puedo ayudarte con:\n\n💬 **Preguntas frecuentes:**\n🔹 "Precio de [producto]"\n🔹 "Información de envíos"\n🔹 "Cómo cambiar talla"\n🔹 "Métodos de pago"\n🔹 "Rastrear mi pedido"\n🔹 "Ver catálogo Nike/Adidas/Puma"\n\n💡 **Tip:** Sé específico con tu consulta\n❓ **Ejemplo:** "Cuánto cuesta el Nike Air Max" o "Horarios de atención"\n\n¿Cómo puedo ayudarte hoy? 😊';
  }

  // Método auxiliar para verificar múltiples palabras clave
  static matchesAny(message, keywords) {
    return keywords.some(keyword => message.includes(keyword.toLowerCase()));
  }

  static detectIntent(userMessage) {
    const message = userMessage.toLowerCase();

    // Intents más específicos y detallados
    if (this.matchesAny(message, ['precio', 'costo', 'valor', 'cuánto', 'cuanto', '$$', 'barato', 'caro', 'oferta', 'descuento'])) {
      return 'product_inquiry';
    }
    if (this.matchesAny(message, ['pedido', 'compra', 'orden', 'seguimiento', 'rastreo', 'track', 'donde está', 'estado'])) {
      return 'order_status';
    }
    if (this.matchesAny(message, ['envío', 'envio', 'entrega', 'delivery', 'shipping', 'cuando llega', 'demora'])) {
      return 'shipping';
    }
    if (this.matchesAny(message, ['cambio', 'devolver', 'devolución', 'devolucion', 'reembolso', 'talla', 'talle'])) {
      return 'return';
    }
    if (this.matchesAny(message, ['pago', 'pagar', 'tarjeta', 'cuotas', 'financiación', 'mercado pago'])) {
      return 'payment';
    }
    if (this.matchesAny(message, ['nike', 'adidas', 'puma', 'new balance', 'marca', 'modelo'])) {
      return 'product_inquiry';
    }
    if (this.matchesAny(message, ['ayuda', 'problema', 'error', 'no funciona', 'soporte'])) {
      return 'support';
    }
    return 'general';
  }
}

module.exports = ChatbotController;
