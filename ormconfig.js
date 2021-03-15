require('dotenv').config();
const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

module.exports = {
  type: 'sqlite',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  entities: [ `${ process.env.TS_NODE === 'true' ? '**/*.entity.ts' : '**/*.entity.js' }` ],

  namingStrategy: new SnakeNamingStrategy(),

  migrationsTableName: process.env.DATABASE_MIGRATIONS_TABLE_NAME,
  migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
  migrations: [ `${ process.env.TS_NODE === 'true' ? '**/*Migration.ts' : '**/*Migration.js' }` ],

  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',

  cli: {
    migrationsDir: 'src/storage/migration'
  }
};
