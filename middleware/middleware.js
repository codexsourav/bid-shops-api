import userdb from '../models/usersModel.js';
import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
    try {
        let token;
        const cookieToken = req.cookies['user'];
        const headerToken = req.headers.authorization;

        if (headerToken) {
            token = headerToken.split(" ")[1];
        } else if (cookieToken) {
            token = cookieToken;
        } else {
            return res.status(401).send({ "error": "You Are Not Authorized", "auth": false });
        }

        if (!token) {
            return res.status(401).send({ "error": "You Are Not Authorized", "auth": false });
        }

        const user = jwt.verify(token, process.env.JWTKEY || "123");
        const getUser = await userdb.findOne({
            "$or": [{ "_id": user.id, }, { "email": user.email }, { "mobile": user.mobile }]
        });

        if (!getUser) {
            return res.status(401).send({ "error": "You Are Not Authorized", "auth": false });
        } else if (getUser.isAllow == false) {
            return res.status(401).send({ "error": "You Account is Suspended", "auth": false });
        }

        req.authUser = getUser;
        next();

    } catch (error) {
        console.log({
            "Error": "Unauthorized User Request",
            "message": error.name,
            "status": "Jwt Error",
        });
        return res.status(401).send({ "error": "You Are Not Authorized", "auth": false, "message": error.toString(), });
    }
}