import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

const { parsed } = config();

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        url: parsed?.DATABASE_URL || process.env.DATABASE_URL,
    },
});
