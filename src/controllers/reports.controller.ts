import { Request, Response } from 'express';
import db from '../services/db.service';
import { v4 as uuid } from 'uuid';

// Create a report
export function createReport(req: Request, res: Response) {
	const { text } = req.body;
	const projectId = req.params.projectId;
	const id = uuid();
	db.run(
		'INSERT INTO reports (id, text, projectId) VALUES (@id, @text, @projectId)',
		{ id, text, projectId },
	);
	res.status(201).send({ id, text, projectId });
}

// Get reports by project
export function getReportsByProject(req: Request, res: Response) {
	const projectId = req.params.projectId;
	const reports = db.query(
		'SELECT * FROM reports WHERE projectId = @projectId',
		{ projectId },
	);
	res.send(reports);
}

// Get a single report
export function getReport(req: Request, res: Response) {
	const id = req.params.id;
	const report = db.query('SELECT * FROM reports WHERE id = @id', { id });
	if (report.length === 0) {
		res.status(404).send({ message: 'Report not found' });
	} else {
		res.send(report[0]);
	}
}

// Update a report
export function updateReport(req: Request, res: Response) {
	const id = req.params.id;
	const { text } = req.body;
	db.run('UPDATE reports SET text = @text WHERE id = @id', { id, text });
	res.send({ id, text });
}

// Delete a report
export function deleteReport(req: Request, res: Response) {
	const id = req.params.id;
	db.run('DELETE FROM reports WHERE id = @id', { id });
	res.status(204).send();
}
