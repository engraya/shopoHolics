import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  // Prisma 7 reads the seed command from here, not from package.json.
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
