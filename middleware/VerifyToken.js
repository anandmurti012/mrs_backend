const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const connection = require('../database/db');
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const VerifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ msg: 'No token provided. Please log in to access this resource.' });
        }
        const verify = jwt.verify(token, SECRET_KEY);
        connection.query(`SELECT * FROM admins WHERE emailId='${verify.email}'`, async function (error, result) {
            if (error) {
                return res.status(404).json({ msg: error.sqlMessage });
            } else {
                const rootUser = result[0]

                if (!rootUser) {
                    return res.status(401).json({ msg: "User Not Found" });
                }
                req.token = token;
                req.rootUser = rootUser;
                next();
            }
        });

    } catch (error) {
        res.status(401).json({ msg: 'Your session has expired or is invalid. Please log in again.' });
    }
}
module.exports = { VerifyToken }