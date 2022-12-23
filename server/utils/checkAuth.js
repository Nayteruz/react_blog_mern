import * as dotenv from 'dotenv'
dotenv.config()
import jwt from "jsonwebtoken";

export default (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
	
	if (token) {
		const secret = process.env.JWTSECRETKEY || '';
		try {
			const decoded = jwt.verify(token, secret);
			
			req.userId = decoded._id;
			
			next();
		} catch (err) {
			return res.status(403).json({
				message: 'Нет доступа'
			})
		}
	} else {
		return res.status(403).json({
			message: 'Нет доступа'
		})
	}
	
	
}