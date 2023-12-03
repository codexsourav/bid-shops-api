import jwt from 'jsonwebtoken';
export default (res, signWith) => {
    var token = jwt.sign(signWith, process.env.JWTKEY || "123");
    res.cookie("user", token, {
        expires: new Date(Date.now() + 280 * 24 * 3600000),
        // cookie for 280 days
    });
    return token;
}