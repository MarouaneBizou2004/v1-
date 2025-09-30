import type { Request, Response } from 'express';

import { createReportHandler } from '../controllers/reportController.js';
import * as reportService from '../services/reportService.js';

describe('createReportHandler', () => {
  it('returns 401 when user is not authenticated', async () => {
    const req = { body: {}, user: undefined } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await createReportHandler(req as any, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('creates report for authenticated users', async () => {
    const req = {
      body: {
        title: 'Broken street light',
        description: 'Lamp post not working near the park entrance',
        category: 'lighting',
        location: { lat: 1, lng: 2 }
      },
      files: [],
      user: { id: '507f1f77bcf86cd799439011', role: 'citizen' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const createSpy = jest.spyOn(reportService, 'createReport').mockResolvedValueOnce({ id: '1' } as any);

    await createReportHandler(req as any, res);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Broken street light',
        description: 'Lamp post not working near the park entrance',
        category: 'lighting',
        location: { lat: 1, lng: 2, address: undefined },
        createdBy: '507f1f77bcf86cd799439011'
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });
});
