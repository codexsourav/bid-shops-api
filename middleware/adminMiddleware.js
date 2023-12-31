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
        }

        if (!getUser.isAdmin) {
            return res.status(401).send({ "error": "You Are Not Authorized - Only Admin Allow This Page", "auth": false });
        }

        req.authUser = getUser;
        next();

    } catch (error) {
        console.log({
            "Error": "Unauthorized User Request",
            "message": error.name,
        });
        return res.status(401).send({ "error": "You Are Not Authorized", "auth": false, "message": error.toString(), });

    }
}