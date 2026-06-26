// OpenAPI 3.0 specification for the ChinaTravel REST API.
// Served via swagger-ui-express at /api/docs (see app.js).
import config from './env.js';

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'ChinaTravel API',
    version: '1.0.0',
    description:
      'API REST de la plataforma ChinaTravel: gestión de ciudades, actividades, ' +
      'rutas (entradas a atracciones), pedidos, reseñas, foro y usuarios.\n\n' +
      'Todas las respuestas siguen el formato `{ ok: boolean, data?, message?, error? }`.\n\n' +
      'Los endpoints protegidos requieren un token JWT en la cabecera ' +
      '`Authorization: Bearer <token>`.',
  },
  servers: [
    { url: '/api', description: 'Servidor actual' },
    { url: `http://localhost:${config.port || 5000}/api`, description: 'Desarrollo local' },
  ],
  tags: [
    { name: 'Auth', description: 'Registro, login y gestión de la cuenta' },
    { name: 'Usuarios', description: 'Administración de usuarios (solo ADMIN)' },
    { name: 'Ciudades', description: 'Destinos de China' },
    { name: 'Actividades', description: 'Actividades turísticas' },
    { name: 'Rutas', description: 'Itinerarios de entradas a atracciones' },
    { name: 'Pedidos', description: 'Reservas de los usuarios' },
    { name: 'Reseñas', description: 'Valoraciones de rutas y actividades' },
    { name: 'Cupones', description: 'Cupones de descuento' },
    { name: 'Notificaciones', description: 'Notificaciones del usuario' },
    { name: 'Foro', description: 'Foro de la comunidad' },
    { name: 'Solicitudes', description: 'Propuestas de contenido (COMERCIAL)' },
    { name: 'Upload', description: 'Subida de imágenes' },
    { name: 'Chat', description: 'Asistente virtual' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido en /auth/login o /auth/registro',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: true },
          data: {},
          message: { type: 'string' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Mensaje de error' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: false },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                msg: { type: 'string' },
                path: { type: 'string' },
              },
            },
          },
        },
      },
      Accesibilidad: {
        type: 'object',
        properties: {
          sillasRuedas: { type: 'boolean' },
          ascensor: { type: 'boolean' },
          habitacionAdaptada: { type: 'boolean' },
          asistenciaEspecial: { type: 'boolean' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          nombre: { type: 'string' },
          apellidos: { type: 'string' },
          email: { type: 'string', format: 'email' },
          telefono: { type: 'string' },
          fechaNacimiento: { type: 'string', format: 'date' },
          genero: { type: 'string', enum: ['', 'MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR'] },
          nacionalidad: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN', 'COMERCIAL'] },
          isActive: { type: 'boolean' },
          isApproved: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              user: { $ref: '#/components/schemas/User' },
            },
          },
        },
      },
      City: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          nombre: { type: 'string', example: 'Pekín' },
          nombreChino: { type: 'string', example: '北京' },
          slug: { type: 'string', example: 'pekin' },
          descripcion: { type: 'string' },
          imagenPortada: { type: 'string' },
          imagenes: { type: 'array', items: { type: 'string' } },
          destacada: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CityInput: {
        type: 'object',
        required: ['nombre', 'slug', 'descripcion'],
        properties: {
          nombre: { type: 'string' },
          nombreChino: { type: 'string' },
          slug: { type: 'string' },
          descripcion: { type: 'string' },
          imagenPortada: { type: 'string' },
          imagenes: { type: 'array', items: { type: 'string' } },
          destacada: { type: 'boolean' },
        },
      },
      Activity: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          nombre: { type: 'string' },
          descripcion: { type: 'string' },
          ciudad: { type: 'string', description: 'ID de la ciudad' },
          categoria: {
            type: 'string',
            enum: ['CULTURAL', 'AVENTURA', 'GASTRONOMIA', 'NATURALEZA', 'COMPRAS', 'NOCTURNO', 'HISTORICO'],
          },
          duracionHoras: { type: 'number' },
          precio: { type: 'number' },
          imagen: { type: 'string' },
          consejos: { type: 'array', items: { type: 'string' } },
          isApproved: { type: 'boolean' },
        },
      },
      Ruta: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          titulo: { type: 'string' },
          descripcion: { type: 'string' },
          ciudad: { type: 'string', description: 'ID de la ciudad' },
          duracionDias: { type: 'number' },
          precio: { type: 'number', description: 'Suma de las entradas de sus actividades (calculado)' },
          imagen: { type: 'string' },
          dias: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                numeroDia: { type: 'number' },
                titulo: { type: 'string' },
                actividades: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      actividad: { type: 'string', description: 'ID de la actividad' },
                      orden: { type: 'number' },
                      horaInicio: { type: 'string' },
                      horaFin: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          usuario: { type: 'string' },
          tipo: { type: 'string', enum: ['RUTA', 'ACTIVIDAD'] },
          ruta: { type: 'string', description: 'ID de la ruta (si tipo=RUTA)' },
          rutaPersonalizada: { type: 'object', description: 'Itinerario personalizado (opcional)' },
          actividad: { type: 'string', description: 'ID de la actividad (si tipo=ACTIVIDAD)' },
          fechaVisita: { type: 'string', format: 'date' },
          horaVisita: { type: 'string' },
          precioTotal: { type: 'number' },
          descuento: { type: 'number' },
          cupon: { type: 'string' },
          estado: {
            type: 'string',
            enum: ['PENDIENTE', 'CONFIRMADO', 'PENDIENTE_CANCELACION', 'CANCELADO', 'REEMBOLSADO'],
          },
          tipsPdfUrl: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      OrderInput: {
        type: 'object',
        properties: {
          tipo: { type: 'string', enum: ['RUTA', 'ACTIVIDAD'], default: 'RUTA' },
          rutaId: { type: 'string', description: 'ID de la ruta (si tipo=RUTA)' },
          actividadesPersonalizadas: { type: 'object', description: 'Mapa { actividadOriginalId: actividadNuevaId | "POR_LIBRE" }' },
          actividadId: { type: 'string', description: 'ID de la actividad (si tipo=ACTIVIDAD)' },
          fechaVisita: { type: 'string', format: 'date' },
          horaVisita: { type: 'string' },
          precioTotal: { type: 'number' },
          cupon: { type: 'string' },
        },
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          usuario: { type: 'string' },
          tipo: { type: 'string', enum: ['RUTA', 'ACTIVIDAD'] },
          referencia: { type: 'string' },
          puntuacion: { type: 'integer', minimum: 1, maximum: 5 },
          titulo: { type: 'string' },
          comentario: { type: 'string' },
          estado: { type: 'string', enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Coupon: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          codigo: { type: 'string' },
          descripcion: { type: 'string' },
          tipo: { type: 'string', enum: ['PORCENTAJE', 'FIJO'] },
          valor: { type: 'number' },
          minCompra: { type: 'number' },
          maxUsos: { type: 'integer', nullable: true },
          usosActuales: { type: 'integer' },
          fechaInicio: { type: 'string', format: 'date-time' },
          fechaFin: { type: 'string', format: 'date-time' },
          activo: { type: 'boolean' },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          usuario: { type: 'string' },
          tipo: { type: 'string', enum: ['PEDIDO', 'RESENA', 'PROMO', 'SISTEMA', 'VIAJE'] },
          titulo: { type: 'string' },
          mensaje: { type: 'string' },
          leido: { type: 'boolean' },
          enlace: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ForumPost: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          titulo: { type: 'string' },
          contenido: { type: 'string' },
          ciudad: { type: 'string' },
          imagen: { type: 'string' },
          autor: { type: 'string' },
          parentPost: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Submission: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          comercial: { type: 'string' },
          tipoContenido: { type: 'string', enum: ['ACTIVIDAD', 'RUTA'] },
          contenido: { type: 'object' },
          estado: { type: 'string', enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'] },
          comentarioAdmin: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'No autenticado / token inválido',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      Forbidden: {
        description: 'Sin permisos para esta acción',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      NotFound: {
        description: 'Recurso no encontrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
    },
  },
  paths: {
    // ---------------- AUTH ----------------
    '/auth/registro': {
      post: {
        tags: ['Auth'], summary: 'Registrar un nuevo usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre', 'email', 'password'],
                properties: {
                  nombre: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: {
                    type: 'string',
                    description: 'Mín. 8 caracteres, con mayúscula, minúscula, número y carácter especial',
                    example: 'Password1!',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuario creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'], summary: 'Obtener el usuario autenticado', security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Datos del usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/perfil': {
      put: {
        tags: ['Auth'], summary: 'Actualizar el perfil', security: [{ bearerAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        responses: { 200: { description: 'Perfil actualizado' }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/auth/solicitar-cambio-email': {
      post: {
        tags: ['Auth'], summary: 'Solicitar cambio de email', security: [{ bearerAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { nuevoEmail: { type: 'string', format: 'email' } } } } } },
        responses: { 200: { description: 'Email de confirmación enviado' } },
      },
    },
    '/auth/confirmar-email/{token}': {
      get: {
        tags: ['Auth'], summary: 'Confirmar cambio de email',
        parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Email actualizado' }, 400: { description: 'Token inválido o expirado' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'], summary: 'Solicitar recuperación de contraseña',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { 200: { description: 'Email de recuperación enviado' } },
      },
    },
    '/auth/reset-password/{token}': {
      put: {
        tags: ['Auth'], summary: 'Restablecer contraseña',
        parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['password'], properties: { password: { type: 'string', example: 'Password1!' } } } } } },
        responses: { 200: { description: 'Contraseña restablecida' }, 400: { description: 'Token inválido o contraseña no válida' } },
      },
    },

    // ---------------- USUARIOS ----------------
    '/usuarios': {
      get: {
        tags: ['Usuarios'], summary: 'Listar usuarios (ADMIN)', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Lista de usuarios' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
      post: {
        tags: ['Usuarios'], summary: 'Crear usuario (ADMIN)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        responses: { 201: { description: 'Usuario creado' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/usuarios/pending-comercials': {
      get: {
        tags: ['Usuarios'], summary: 'Comerciales pendientes de aprobación (ADMIN)', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Lista de comerciales pendientes' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/usuarios/{id}': {
      put: {
        tags: ['Usuarios'], summary: 'Actualizar rol de usuario (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { role: { type: 'string', enum: ['USER', 'ADMIN', 'COMERCIAL'] } } } } } },
        responses: { 200: { description: 'Usuario actualizado' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        tags: ['Usuarios'], summary: 'Eliminar usuario (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Usuario eliminado' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/usuarios/{id}/approve': {
      put: {
        tags: ['Usuarios'], summary: 'Aprobar comercial (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Comercial aprobado' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },

    // ---------------- CIUDADES ----------------
    '/ciudades': {
      get: {
        tags: ['Ciudades'], summary: 'Listar todas las ciudades',
        responses: { 200: { description: 'Lista de ciudades', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/City' } } } } } } } },
      },
      post: {
        tags: ['Ciudades'], summary: 'Crear ciudad (ADMIN)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CityInput' } } } },
        responses: { 201: { description: 'Ciudad creada' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/ciudades/destacadas': {
      get: {
        tags: ['Ciudades'], summary: 'Listar ciudades destacadas',
        responses: { 200: { description: 'Ciudades destacadas' } },
      },
    },
    '/ciudades/{slug}': {
      get: {
        tags: ['Ciudades'], summary: 'Obtener una ciudad por slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'pekin' }],
        responses: { 200: { description: 'Ciudad', content: { 'application/json': { schema: { $ref: '#/components/schemas/City' } } } }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/ciudades/{id}': {
      put: {
        tags: ['Ciudades'], summary: 'Actualizar ciudad (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CityInput' } } } },
        responses: { 200: { description: 'Ciudad actualizada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        tags: ['Ciudades'], summary: 'Eliminar ciudad (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Ciudad eliminada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },

    // ---------------- ACTIVIDADES ----------------
    '/actividades': {
      get: {
        tags: ['Actividades'], summary: 'Listar actividades',
        parameters: [{ name: 'ciudad', in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de ciudad' }],
        responses: { 200: { description: 'Lista de actividades', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Activity' } } } } } } } },
      },
      post: {
        tags: ['Actividades'], summary: 'Crear actividad (ADMIN)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Activity' } } } },
        responses: { 201: { description: 'Actividad creada' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/actividades/{id}': {
      get: {
        tags: ['Actividades'], summary: 'Obtener una actividad',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Actividad', content: { 'application/json': { schema: { $ref: '#/components/schemas/Activity' } } } }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      put: {
        tags: ['Actividades'], summary: 'Actualizar actividad (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Activity' } } } },
        responses: { 200: { description: 'Actividad actualizada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        tags: ['Actividades'], summary: 'Eliminar actividad (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Actividad eliminada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },

    // ---------------- RUTAS ----------------
    '/rutas': {
      get: {
        tags: ['Rutas'], summary: 'Listar rutas',
        parameters: [{ name: 'ciudad', in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de ciudad' }],
        responses: { 200: { description: 'Lista de rutas', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Ruta' } } } } } } } },
      },
      post: {
        tags: ['Rutas'], summary: 'Crear ruta (ADMIN)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Ruta' } } } },
        responses: { 201: { description: 'Ruta creada' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/rutas/{id}': {
      get: {
        tags: ['Rutas'], summary: 'Obtener una ruta',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Ruta', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ruta' } } } }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      put: {
        tags: ['Rutas'], summary: 'Actualizar ruta (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Ruta' } } } },
        responses: { 200: { description: 'Ruta actualizada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        tags: ['Rutas'], summary: 'Eliminar ruta (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Ruta eliminada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/rutas/{id}/actividades-alternativas': {
      get: {
        tags: ['Rutas'], summary: 'Actividades alternativas para una ruta',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Actividades alternativas' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },

    // ---------------- PEDIDOS ----------------
    '/pedidos': {
      post: {
        tags: ['Pedidos'], summary: 'Crear un pedido (USER)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderInput' } } } },
        responses: { 201: { description: 'Pedido creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/pedidos/batch': {
      post: {
        tags: ['Pedidos'], summary: 'Crear varios pedidos a la vez (USER)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { items: { type: 'array', items: { $ref: '#/components/schemas/OrderInput' } } } } } } },
        responses: { 201: { description: 'Pedidos creados' } },
      },
    },
    '/pedidos/mis-pedidos': {
      get: {
        tags: ['Pedidos'], summary: 'Listar mis pedidos (USER)', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Mis pedidos' }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/pedidos/todos': {
      get: {
        tags: ['Pedidos'], summary: 'Listar todos los pedidos (ADMIN)', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Todos los pedidos' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/pedidos/recomendaciones': {
      get: {
        tags: ['Pedidos'], summary: 'Recomendaciones para el usuario (USER)', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Recomendaciones' } },
      },
    },
    '/pedidos/{id}': {
      get: {
        tags: ['Pedidos'], summary: 'Obtener un pedido', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Pedido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        tags: ['Pedidos'], summary: 'Eliminar pedido (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Pedido eliminado' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/pedidos/{id}/tips-pdf': {
      get: {
        tags: ['Pedidos'], summary: 'Descargar PDF de consejos del pedido', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'PDF', content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } } } },
      },
    },
    '/pedidos/{id}/cancelar': {
      put: {
        tags: ['Pedidos'], summary: 'Solicitar cancelación de pedido (USER)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { motivoCancelacion: { type: 'string' } } } } } },
        responses: { 200: { description: 'Cancelación solicitada' } },
      },
    },
    '/pedidos/{id}/aprobar-cancelacion': {
      put: {
        tags: ['Pedidos'], summary: 'Aprobar cancelación (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Cancelación aprobada' } },
      },
    },
    '/pedidos/{id}/rechazar-cancelacion': {
      put: {
        tags: ['Pedidos'], summary: 'Rechazar cancelación (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Cancelación rechazada' } },
      },
    },

    // ---------------- RESEÑAS ----------------
    '/resenas': {
      post: {
        tags: ['Reseñas'], summary: 'Crear una reseña', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tipo', 'referenciaId', 'puntuacion', 'comentario'],
                properties: {
                  tipo: { type: 'string', enum: ['RUTA', 'ACTIVIDAD'] },
                  referenciaId: { type: 'string' },
                  puntuacion: { type: 'integer', minimum: 1, maximum: 5 },
                  titulo: { type: 'string' },
                  comentario: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Reseña creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Review' } } } }, 400: { description: 'Tipo inválido o reseña duplicada' } },
      },
    },
    '/resenas/{tipo}/{referenciaId}': {
      get: {
        tags: ['Reseñas'], summary: 'Obtener reseñas aprobadas de un elemento',
        parameters: [
          { name: 'tipo', in: 'path', required: true, schema: { type: 'string', enum: ['ruta', 'actividad'] } },
          { name: 'referenciaId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Reseñas, promedio y total', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'object', properties: { reviews: { type: 'array', items: { $ref: '#/components/schemas/Review' } }, promedio: { type: 'number' }, total: { type: 'integer' } } } } } } } } },
      },
    },
    '/resenas/admin/pendientes': {
      get: {
        tags: ['Reseñas'], summary: 'Listar reseñas por estado (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'estado', in: 'query', schema: { type: 'string', enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'] } }],
        responses: { 200: { description: 'Reseñas' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/resenas/admin/{id}': {
      put: {
        tags: ['Reseñas'], summary: 'Moderar reseña (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { estado: { type: 'string', enum: ['APROBADO', 'RECHAZADO'] } } } } } },
        responses: { 200: { description: 'Reseña moderada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        tags: ['Reseñas'], summary: 'Eliminar reseña (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Reseña eliminada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },

    // ---------------- CUPONES ----------------
    '/cupones/validar': {
      post: {
        tags: ['Cupones'], summary: 'Validar un cupón', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['codigo', 'total'], properties: { codigo: { type: 'string' }, total: { type: 'number' } } } } } },
        responses: { 200: { description: 'Cupón válido con descuento calculado' }, 400: { description: 'Cupón inválido o expirado' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/cupones': {
      get: {
        tags: ['Cupones'], summary: 'Listar cupones (ADMIN)', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Lista de cupones', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Coupon' } } } } } } } },
      },
      post: {
        tags: ['Cupones'], summary: 'Crear cupón (ADMIN)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Coupon' } } } },
        responses: { 201: { description: 'Cupón creado' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/cupones/{id}': {
      put: {
        tags: ['Cupones'], summary: 'Actualizar cupón (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Coupon' } } } },
        responses: { 200: { description: 'Cupón actualizado' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        tags: ['Cupones'], summary: 'Eliminar cupón (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Cupón eliminado' } },
      },
    },

    // ---------------- NOTIFICACIONES ----------------
    '/notificaciones': {
      get: {
        tags: ['Notificaciones'], summary: 'Listar mis notificaciones', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Notificaciones y contador sin leer', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'object', properties: { notifications: { type: 'array', items: { $ref: '#/components/schemas/Notification' } }, sinLeer: { type: 'integer' } } } } } } } } },
      },
    },
    '/notificaciones/{id}/leer': {
      put: {
        tags: ['Notificaciones'], summary: 'Marcar notificación como leída', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Marcada como leída' } },
      },
    },
    '/notificaciones/leer-todo': {
      put: {
        tags: ['Notificaciones'], summary: 'Marcar todas como leídas', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Todas marcadas como leídas' } },
      },
    },

    // ---------------- FORO ----------------
    '/foro': {
      get: {
        tags: ['Foro'], summary: 'Listar publicaciones del foro',
        responses: { 200: { description: 'Lista de publicaciones', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/ForumPost' } } } } } } } },
      },
      post: {
        tags: ['Foro'], summary: 'Crear publicación', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['contenido'], properties: { titulo: { type: 'string' }, contenido: { type: 'string' }, ciudad: { type: 'string' }, imagen: { type: 'string' } } } } } },
        responses: { 201: { description: 'Publicación creada' }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/foro/{id}': {
      get: {
        tags: ['Foro'], summary: 'Obtener una publicación con respuestas',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Publicación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ForumPost' } } } }, 404: { $ref: '#/components/responses/NotFound' } },
      },
      delete: {
        tags: ['Foro'], summary: 'Eliminar publicación', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Publicación eliminada' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/foro/{postId}/reply': {
      post: {
        tags: ['Foro'], summary: 'Responder a una publicación', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['contenido'], properties: { contenido: { type: 'string' } } } } } },
        responses: { 201: { description: 'Respuesta creada' } },
      },
    },

    // ---------------- SOLICITUDES ----------------
    '/solicitudes': {
      get: {
        tags: ['Solicitudes'], summary: 'Listar solicitudes (ADMIN)', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Lista de solicitudes' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
      post: {
        tags: ['Solicitudes'], summary: 'Crear solicitud de contenido (COMERCIAL)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { tipoContenido: { type: 'string', enum: ['ACTIVIDAD', 'RUTA'] }, contenido: { type: 'string', description: 'JSON con el contenido propuesto' }, imagen: { type: 'string', format: 'binary' } } } } } },
        responses: { 201: { description: 'Solicitud creada' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/solicitudes/mis-solicitudes': {
      get: {
        tags: ['Solicitudes'], summary: 'Mis solicitudes (COMERCIAL)', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Mis solicitudes' } },
      },
    },
    '/solicitudes/{id}/aprobar': {
      put: {
        tags: ['Solicitudes'], summary: 'Aprobar solicitud (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Solicitud aprobada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/solicitudes/{id}/rechazar': {
      put: {
        tags: ['Solicitudes'], summary: 'Rechazar solicitud (ADMIN)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { comentarioAdmin: { type: 'string' } } } } } },
        responses: { 200: { description: 'Solicitud rechazada' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },

    // ---------------- UPLOAD ----------------
    '/upload/imagen': {
      post: {
        tags: ['Upload'], summary: 'Subir una imagen', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { imagen: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'URL de la imagen subida', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'object', properties: { url: { type: 'string' } } } } } } } }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },

    // ---------------- CHAT ----------------
    '/chat/message': {
      post: {
        tags: ['Chat'], summary: 'Enviar mensaje al asistente virtual',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['message'], properties: { message: { type: 'string' } } } } } },
        responses: { 200: { description: 'Respuesta del bot', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'object', properties: { reply: { type: 'string' }, type: { type: 'string', enum: ['bot', 'fallback'] } } } } } } } }, 400: { description: 'Mensaje vacío' } },
      },
    },
    '/chat/contact': {
      post: {
        tags: ['Chat'], summary: 'Escalar la consulta a un agente humano (email)',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'mensaje'], properties: { nombre: { type: 'string' }, email: { type: 'string', format: 'email' }, mensaje: { type: 'string' }, historial: { type: 'array', items: { type: 'object' } } } } } } },
        responses: { 200: { description: 'Consulta enviada' }, 400: { description: 'Email y mensaje obligatorios' } },
      },
    },
  },
};

export default swaggerSpec;
