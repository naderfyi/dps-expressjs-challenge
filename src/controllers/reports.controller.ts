import { Request, Response } from 'express';
import db from '../services/db.service';
import { v4 as uuid } from 'uuid';

interface Report {
	id: string;
	text: string;
	projectId: string;
}

// Create a report
export function createReport(req: Request, res: Response) {
	const { text } = req.body;
	const projectId = req.params.projectId;

	if (!text || !projectId) {
		return res
			.status(400)
			.send({ message: 'Text and projectId are required' });
	}

	const id = uuid();
	try {
		db.run(
			'INSERT INTO reports (id, text, projectId) VALUES (@id, @text, @projectId)',
			{ id, text, projectId },
		);
		res.status(201).send({ id, text, projectId });
	} catch (error) {
		console.error('Error creating report:', error);
		res.status(500).send({ message: 'Failed to create report', error });
	}
}

// Get reports by project
export function getReportsByProject(req: Request, res: Response) {
	const projectId = req.params.projectId;

	try {
		const project = db.query(
			'SELECT * FROM projects WHERE id = @projectId',
			{
				projectId,
			},
		);
		if (project.length === 0) {
			return res.status(404).send({ message: 'Project not found' });
		}

		const reports = db.query(
			'SELECT * FROM reports WHERE projectId = @projectId',
			{ projectId },
		);
		res.send(reports);
	} catch (error) {
		console.error('Error fetching reports by project:', error);
		res.status(500).send({ message: 'Failed to retrieve reports', error });
	}
}

// Get a single report
export function getReport(req: Request, res: Response) {
	const id = req.params.id;

	try {
		const report = db.query('SELECT * FROM reports WHERE id = @id', { id });
		if (report.length === 0) {
			return res.status(404).send({ message: 'Report not found' });
		} else {
			res.send(report[0]);
		}
	} catch (error) {
		console.error('Error fetching report:', error);
		res.status(500).send({ message: 'Failed to retrieve report', error });
	}
}

// Update a report
export function updateReport(req: Request, res: Response) {
	const id = req.params.id;
	const { text } = req.body;

	if (!text) {
		return res.status(400).send({ message: 'Text is required' });
	}

	try {
		const result = db.run(
			'UPDATE reports SET text = @text WHERE id = @id',
			{ id, text },
		);
		if (result.changes === 0) {
			return res.status(404).send({ message: 'Report not found' });
		} else {
			res.send({ id, text });
		}
	} catch (error) {
		console.error('Error updating report:', error);
		res.status(500).send({ message: 'Failed to update report', error });
	}
}

// Delete a report
export function deleteReport(req: Request, res: Response) {
	const id = req.params.id;

	try {
		const result = db.run('DELETE FROM reports WHERE id = @id', { id });
		if (result.changes === 0) {
			return res.status(404).send({ message: 'Report not found' });
		}
		res.status(204).send();
	} catch (error) {
		console.error('Error deleting report:', error);
		res.status(500).send({ message: 'Failed to delete report', error });
	}
}

// Function to check if any word appears at least three times
function hasFrequentWord(text: string): boolean {
	const words = text.toLowerCase().match(/\w+/g) || [];
	const wordCounts = words.reduce(
		(acc, word) => {
			acc[word] = acc[word] ? acc[word] + 1 : 1;
			return acc;
		},
		{} as { [key: string]: number },
	);

	return Object.values(wordCounts).some((count) => count >= 3);
}

// API Endpoint to get reports with frequent words
export function getFrequentWordReports(req: Request, res: Response) {
	try {
		// Assuming db.query returns an array of Report objects
		const reports = db.query('SELECT * FROM reports') as Report[];
		const frequentWordReports = reports.filter((report) =>
			hasFrequentWord(report.text),
		);
		res.send(frequentWordReports);
	} catch (error) {
		console.error('Error fetching reports:', error);
		res.status(500).send({ message: 'Error fetching reports', error });
	}
}
