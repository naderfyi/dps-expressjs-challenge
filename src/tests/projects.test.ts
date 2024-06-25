import request from 'supertest';
import app from '../../src/index';
import db from '../../src/services/db.service';

beforeAll(() => {
	db.run('DELETE FROM projects');
});

afterAll(() => {
	db.run('DELETE FROM projects');
});

describe('Projects API', () => {
	let projectId: string;

	it('should create a new project', async () => {
		const res = await request(app).post('/projects').send({
			name: 'Project 1',
			description: 'Description 1',
		});
		expect(res.status).toBe(201);
		expect(res.body.id).toBeDefined();
		projectId = res.body.id;
	});

	it('should get all projects', async () => {
		const res = await request(app).get('/projects');
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
	});

	it('should get a single project', async () => {
		const res = await request(app).get(`/projects/${projectId}`);
		expect(res.status).toBe(200);
		expect(res.body.id).toBe(projectId);
	});

	it('should update a project', async () => {
		const res = await request(app).put(`/projects/${projectId}`).send({
			name: 'Updated Project 1',
			description: 'Updated Description 1',
		});
		expect(res.status).toBe(200);
		expect(res.body.name).toBe('Updated Project 1');
	});

	it('should delete a project', async () => {
		const res = await request(app).delete(`/projects/${projectId}`);
		expect(res.status).toBe(204);
	});
});
