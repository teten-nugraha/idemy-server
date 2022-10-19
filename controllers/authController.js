import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";

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