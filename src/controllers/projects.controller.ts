import { Request, Response } from 'express';
import db from '../services/db.service';
import { v4 as uuid } from 'uuid';

// Create a new project
export function createProject(req: Request, res: Response) {
	const { name, description } = req.body;

	if (!name || !description) {
		return res
			.status(400)
			.send({ message: 'Name and description are required' });
	}

	const id = uuid();
	try {
		db.run(
			'INSERT INTO projects (id, name, description) VALUES (@id, @name, @description)',
			{ id, name, description },
		);
		res.status(201).send({ id, name, description });
	} catch (error) {
		res.status(500).send({ message: 'Failed to create project', error });
	}
}

// Get all projects
export function getAllProjects(req: Request, res: Response) {
	try {
		const projects = db.query('SELECT * FROM projects');
		res.send(projects);
	} catch (error) {
		res.status(500).send({ message: 'Failed to retrieve projects', error });
	}
}

// Get a single project
export function getProject(req: Request, res: Response) {
	const id = req.params.id;

	try {
		const project = db.query('SELECT * FROM projects WHERE id = @id', {
			id,
		});
		if (project.length === 0) {
			res.status(404).send({ message: 'Project not found' });
		} else {
			res.send(project[0]);
		}
	} catch (error) {
		res.status(500).send({ message: 'Failed to retrieve project', error });
	}
}

// Update a project
export function updateProject(req: Request, res: Response) {
	const id = req.params.id;
	const { name, description } = req.body;

	if (!name || !description) {
		return res
			.status(400)
			.send({ message: 'Name and description are required' });
	}

	try {
		const result = db.run(
			'UPDATE projects SET name = @name, description = @description WHERE id = @id',
			{ id, name, description },
		);
		if (result.changes === 0) {
			res.status(404).send({ message: 'Project not found' });
		} else {
			res.send({ id, name, description });
		}
	} catch (error) {
		res.status(500).send({ message: 'Failed to update project', error });
	}
}

// Delete a project
export function deleteProject(req: Request, res: Response) {
	const id = req.params.id;

	try {
		// Check if the project exists before attempting to delete
		const project = db.query('SELECT * FROM projects WHERE id = @id', {
			id,
		});
		if (project.length === 0) {
			console.error(`Project with id ${id} not found`);
			return res.status(404).send({ message: 'Project not found' });
		}

		// Delete the project
		db.run('DELETE FROM projects WHERE id = @id', { id });

		// Delete related reports
		db.run('DELETE FROM reports WHERE projectId = @id', { id });

		res.status(204).send();
	} catch (error) {
		console.error('Error deleting project:', error);
		res.status(500).send({ message: 'Failed to delete project', error });
	}
}
