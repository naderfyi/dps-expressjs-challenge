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
		const res = await request(app)
			.post('/projects')
			.set('Authorization', 'Password123')
			.send({
				name: 'Project 1',
				description: 'Description 1',
			});
		expect(res.status).toBe(201);
		expect(res.body.id).toBeDefined();
		projectId = res.body.id;
	});

	it('should get all projects', async () => {
		const res = await request(app)
			.get('/projects')
			.set('Authorization', 'Password123');
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
	});

	it('should get a single project', async () => {
		const res = await request(app)
			.get(`/projects/${projectId}`)
			.set('Authorization', 'Password123');
		expect(res.status).toBe(200);
		expect(res.body.id).toBe(projectId);
	});

	it('should update a project', async () => {
		const res = await request(app)
			.put(`/projects/${projectId}`)
			.set('Authorization', 'Password123')
			.send({
				name: 'Updated Project 1',
				description: 'Updated Description 1',
			});
		expect(res.status).toBe(200);
		expect(res.body.name).toBe('Updated Project 1');
	});

	it('should delete a project', async () => {
		const res = await request(app)
			.delete(`/projects/${projectId}`)
			.set('Authorization', 'Password123');
		expect(res.status).toBe(204);
	});

	it('should create a new project, add reports, and delete the project along with its reports', async () => {
		// Create a new project
		const createProjectRes = await request(app)
			.post('/projects')
			.set('Authorization', 'Password123')
			.send({
				name: 'Project 1',
				description: 'Description 1',
			});
		expect(createProjectRes.status).toBe(201);
		expect(createProjectRes.body.id).toBeDefined();
		projectId = createProjectRes.body.id;

		// Create 3 reports for the project
		for (let i = 1; i <= 3; i++) {
			const createReportRes = await request(app)
				.post(`/projects/${projectId}/reports`)
				.set('Authorization', 'Password123')
				.send({
					text: `Report text ${i}`,
				});
			expect(createReportRes.status).toBe(201);
			expect(createReportRes.body.id).toBeDefined();
		}

		// Delete the project
		const deleteProjectRes = await request(app)
			.delete(`/projects/${projectId}`)
			.set('Authorization', 'Password123');
		expect(deleteProjectRes.status).toBe(204);

		// Verify the project has been deleted
		const getProjectRes = await request(app)
			.get(`/projects/${projectId}`)
			.set('Authorization', 'Password123');
		expect(getProjectRes.status).toBe(404);

		// Verify the reports have been deleted
		const getReportsRes = await request(app)
			.get(`/projects/${projectId}/reports`)
			.set('Authorization', 'Password123');
		expect(getReportsRes.status).toBe(404);
	});

	it('should handle project without reports', async () => {
		const res = await request(app)
			.post('/projects')
			.set('Authorization', 'Password123')
			.send({
				name: 'Project without Reports',
				description: 'This project has no reports',
			});
		expect(res.status).toBe(201);
		const projectId = res.body.id;

		const reportsRes = await request(app)
			.get(`/projects/${projectId}/reports`)
			.set('Authorization', 'Password123');
		expect(reportsRes.status).toBe(200);
		expect(reportsRes.body.length).toBe(0);
	});
});
