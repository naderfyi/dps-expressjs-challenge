import { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const token = req.headers.authorization;
	if (token === 'Password123') {
		next();
	} else {
		res.status(401).send({ message: 'Unauthorized' });
	}
}
