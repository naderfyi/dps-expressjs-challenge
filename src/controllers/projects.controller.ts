import { Request, Response } from 'express';
import db from '../services/db.service';
import { v4 as uuid } from 'uuid';

// Create a new project
export function createProject(req: Request, res: Response) {
	const { name, description } = req.body;
	const id = uuid();
	db.run(
		'INSERT INTO projects (id, name, description) VALUES (@id, @name, @description)',
		{ id, name, description },
	);
	res.status(201).send({ id, name, description });
}

// Get all projects
export function getAllProjects(req: Request, res: Response) {
	const projects = db.query('SELECT * FROM projects');
	res.send(projects);
}

// Get a single project
export function getProject(req: Request, res: Response) {
	const id = req.params.id;
	const project = db.query('SELECT * FROM projects WHERE id = @id', { id });
	if (project.length === 0) {
		res.status(404).send({ message: 'Project not found' });
	} else {
		res.send(project[0]);
	}
}

// Update a project
export function updateProject(req: Request, res: Response) {
	const id = req.params.id;
	const { name, description } = req.body;
	db.run(
		'UPDATE projects SET name = @name, description = @description WHERE id = @id',
		{ id, name, description },
	);
	res.send({ id, name, description });
}

// Delete a project
export function deleteProject(req: Request, res: Response) {
	const id = req.params.id;
	db.run('DELETE FROM projects WHERE id = @id', { id });

	db.run('DELETE FROM reports WHERE projectId = @id', { id });

	res.status(204).send();
}
