import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config()
export const generateAccessToken = (userId: string, role: string): string => {
    return jwt.sign(
        { userId, role },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: "15m",
        }
    )
}

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: "7d",
        }
    )
}