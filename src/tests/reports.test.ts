import request from 'supertest';
import app from '../../src/index';
import db from '../../src/services/db.service';

beforeAll(() => {
	db.run('DELETE FROM projects');
	db.run('DELETE FROM reports');
});

afterAll(() => {
	db.run('DELETE FROM projects');
	db.run('DELETE FROM reports');
});

describe('Reports API', () => {
	let projectId: string;
	let reportId: string;

	beforeAll(async () => {
		const res = await request(app).post('/projects').send({
			name: 'Project for Reports',
			description: 'Description for Reports',
		});
		projectId = res.body.id;
	});

	it('should create a new report', async () => {
		const res = await request(app)
			.post(`/projects/${projectId}/reports`)
			.send({
				text: 'Report text',
			});
		expect(res.status).toBe(201);
		expect(res.body.id).toBeDefined();
		reportId = res.body.id;
	});

	it('should get reports by project', async () => {
		const res = await request(app).get(`/projects/${projectId}/reports`);
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
	});

	it('should get a single report', async () => {
		const res = await request(app).get(`/reports/${reportId}`);
		expect(res.status).toBe(200);
		expect(res.body.id).toBe(reportId);
	});

	it('should update a report', async () => {
		const res = await request(app).put(`/reports/${reportId}`).send({
			text: 'Updated report text',
		});
		expect(res.status).toBe(200);
		expect(res.body.text).toBe('Updated report text');
	});

	it('should delete a report', async () => {
		const res = await request(app).delete(`/reports/${reportId}`);
		expect(res.status).toBe(204);
	});
});

describe('Frequent Word Reports API', () => {
	it('should retrieve reports with a frequent word', async () => {
		const mockReports = [
			{ id: '1', text: 'hello hello hello world', projectId: 'p1' },
			{ id: '2', text: 'test test', projectId: 'p2' },
		];

		jest.spyOn(db, 'query').mockReturnValue(mockReports);

		const res = await request(app).get('/reports/frequent-word');
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBe(1);
		expect(res.body[0].id).toBe('1');
	});
});
