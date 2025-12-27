import jwt from "jsonwebtoken";

export const generateToken = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    const isDevlopment = process.env.NODE_ENV === "development";

    res.cookie("jwtCookie", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // in milliseconds
        httpOnly: true,
        sameSite: isDevlopment ? "strict" : "none", //strict : means both server and client are on same domian (eg. localhost:5000 & localhost:5173)
        secure: !isDevlopment, // true when deployed
    });

    return token;
};
