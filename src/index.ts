import express, { Express } from 'express';
import dotenv from 'dotenv';
import { authenticate } from './middleware/auth.middleware';
import {
	createProject,
	getAllProjects,
	getProject,
	updateProject,
	deleteProject,
} from './controllers/projects.controller';
import {
	createReport,
	getReportsByProject,
	getReport,
	updateReport,
	deleteReport,
	getFrequentWordReports,
} from './controllers/reports.controller';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use authentication middleware for all routes
app.use(authenticate);

// Projects
app.post('/projects', createProject);
app.get('/projects', getAllProjects);
app.get('/projects/:id', getProject);
app.put('/projects/:id', updateProject);
app.delete('/projects/:id', deleteProject);

// Frequent word reports
app.get('/reports/frequent-word', getFrequentWordReports);

// Reports
app.post('/projects/:projectId/reports', createReport);
app.get('/projects/:projectId/reports', getReportsByProject);
app.get('/reports/:id', getReport);
app.put('/reports/:id', updateReport);
app.delete('/reports/:id', deleteReport);

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
}
export default app;
