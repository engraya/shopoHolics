import "dotenv/config";
import { encode } from "next-auth/jwt";

const token = await encode({
  token: {
    id: process.argv[2],
    sub: process.argv[2],
    role: "USER",
    name: "Debug User",
    email: "debug@example.com",
  },
  secret: process.env.AUTH_SECRET,
  salt: "authjs.session-token",
});
console.log(token);
