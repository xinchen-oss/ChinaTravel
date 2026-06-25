import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/Submission.js', () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
}));
jest.unstable_mockModule('../../src/models/Activity.js', () => ({
  default: { create: jest.fn() },
}));
jest.unstable_mockModule('../../src/models/Ruta.js', () => ({
  default: { create: jest.fn(), findById: jest.fn() },
}));
jest.unstable_mockModule('../../src/models/User.js', () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule('../../src/services/emailService.js', () => ({
  sendEmail: jest.fn(),
}));

const { default: Submission } = await import('../../src/models/Submission.js');
const { default: Activity } = await import('../../src/models/Activity.js');
const { default: Ruta } = await import('../../src/models/Ruta.js');
const { default: User } = await import('../../src/models/User.js');
const { sendEmail } = await import('../../src/services/emailService.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const { SUBMISSION_STATUS } = await import('../../src/utils/constants.js');
const {
  createSubmission,
  getSubmissions,
  getMySubmissions,
  approveSubmission,
  rejectSubmission,
} = await import('../../src/controllers/submissionController.js');

beforeEach(() => jest.clearAllMocks());

describe('submissionController.createSubmission', () => {
  it('crea solicitud y notifica admins', async () => {
    Submission.create.mockResolvedValue({ _id: 's1' });
    User.find.mockResolvedValue([{ email: 'admin@test.com' }]);
    const res = mockRes();
    await createSubmission(
      {
        user: { _id: 'u1', nombre: 'Test', email: 'u@t.com' },
        body: { tipoContenido: 'ACTIVIDAD', contenido: { nombre: 'A' } },
      },
      res
    );
    expect(Submission.create).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalledWith({ role: 'ADMIN' });
    expect(sendEmail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('parsea contenido si viene como string JSON', async () => {
    Submission.create.mockResolvedValue({});
    User.find.mockResolvedValue([]);
    await createSubmission(
      {
        user: { _id: 'u1', nombre: 'T', email: 'u@t.com' },
        body: { tipoContenido: 'RUTA', contenido: JSON.stringify({ titulo: 'R' }) },
      },
      mockRes()
    );
    expect(Submission.create).toHaveBeenCalledWith(
      expect.objectContaining({ tipoContenido: 'RUTA', contenido: { titulo: 'R' } })
    );
  });
});

describe('submissionController.getSubmissions', () => {
  it('filtra por estado', async () => {
    const data = [{ _id: '1' }];
    Submission.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getSubmissions({ query: { estado: 'PENDIENTE' } }, res);
    expect(Submission.find).toHaveBeenCalledWith({ estado: 'PENDIENTE' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('submissionController.getMySubmissions', () => {
  it('devuelve solicitudes del usuario', async () => {
    Submission.find.mockReturnValue(chainable([]));
    await getMySubmissions({ user: { _id: 'u1' } }, mockRes());
    expect(Submission.find).toHaveBeenCalledWith({ comercial: 'u1' });
  });
});

describe('submissionController.approveSubmission', () => {
  const buildSubmission = (overrides = {}) => ({
    estado: SUBMISSION_STATUS.PENDIENTE,
    tipoContenido: 'ACTIVIDAD',
    contenido: {},
    comentarioAdmin: '',
    comercial: { _id: 'u1', email: 'u@t.com', nombre: 'Test' },
    save: jest.fn().mockResolvedValue(),
    ...overrides,
  });

  it('aprueba ACTIVIDAD: crea Activity, envía email', async () => {
    Submission.findById.mockReturnValue(chainable(buildSubmission()));
    const res = mockRes();
    await approveSubmission({ params: { id: '1' }, body: {} }, res);
    expect(Activity.create).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
  });

  it('aprueba RUTA: crea Ruta y recalcula precio', async () => {
    Ruta.create.mockResolvedValue({ _id: 'r1' });
    Ruta.findById.mockReturnValue(chainable({ dias: [], precio: 0, save: jest.fn().mockResolvedValue() }));
    Submission.findById.mockReturnValue(chainable(buildSubmission({ tipoContenido: 'RUTA' })));
    await approveSubmission({ params: { id: '1' }, body: {} }, mockRes());
    expect(Ruta.create).toHaveBeenCalled();
  });

  it('rechaza si la solicitud ya no está pendiente', async () => {
    Submission.findById.mockReturnValue(
      chainable(buildSubmission({ estado: SUBMISSION_STATUS.APROBADO }))
    );
    await expect(
      approveSubmission({ params: { id: '1' }, body: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('submissionController.rejectSubmission', () => {
  it('rechaza solicitud y envía email', async () => {
    const sub = {
      estado: SUBMISSION_STATUS.PENDIENTE,
      tipoContenido: 'RUTA',
      contenido: {},
      comentarioAdmin: '',
      comercial: { email: 'u@t.com', nombre: 'Test' },
      save: jest.fn().mockResolvedValue(),
    };
    Submission.findById.mockReturnValue(chainable(sub));
    await rejectSubmission({ params: { id: '1' }, body: { comentario: 'No' } }, mockRes());
    expect(sub.save).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
  });

  it('lanza ApiError si ya estaba rechazada', async () => {
    Submission.findById.mockReturnValue(
      chainable({ estado: SUBMISSION_STATUS.RECHAZADO })
    );
    await expect(
      rejectSubmission({ params: { id: '1' }, body: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});
