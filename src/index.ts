import express, { Express } from 'express';
import dotenv from 'dotenv';
import {
	createProject,
	getAllProjects,
	getProject,
	updateProject,
	deleteProject,
} from './controllers/projects.controller';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Projects
app.post('/projects', createProject);
app.get('/projects', getAllProjects);
app.get('/projects/:id', getProject);
app.put('/projects/:id', updateProject);
app.delete('/projects/:id', deleteProject);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
