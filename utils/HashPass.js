import bcrypt from 'bcryptjs'

export default (pass) => {
    return bcrypt.hashSync(pass.toString(), 10);
}

export const validateHashPass = (hash, pass) => {
    return bcrypt.compareSync(pass, hash.toString());
}