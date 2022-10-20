import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

/**
 * Register API
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name) return res.status(400).send('Name is required');
        if(!password || password.lean < 6) {
            return res
                .status(400)
                .send("Password is required and should be min 6 char")
        }

        let userExist = await User.findOne({ email }).exec();
        if(userExist) return res.status(400).send('Email is taken');

        // hashed pass
        const hashedPassword = await hashPassword(password);

        //register
        const user = new User({
            name,
            email,
            password: hashedPassword,
        }).save();

        console.log("saved user", user);

        return res.json({ ok: true });

    }catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again ");
    }
};

/**
 * Login API
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const login = async (req, res) => {
    try{
        const { email, password }  = req.body;

        const user = await User.findOne({ email }).exec();
        if(!user) return res.status(400).send('No user found');

        // check password
        const match = await comparePassword(password, user.password);

        // create signed jwt
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        user.password = undefined;

        res.cookie("token", token, {
            httpOnly: true,
        });

        res.json(user);
    }catch (err) {
        console.log(err);
        return res.status(400).send("Error.. try again");
    }
}