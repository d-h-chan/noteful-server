module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DB_URL || 'postgres://fvrvpqeebbksin:21ae0afbe17baa51212426eb9d4d32a02551a45c8d33b769c8a113a27d79f0b8@ec2-174-129-33-13.compute-1.amazonaws.com:5432/d1osgbjl01orc1?ssl=true',
  TEST_DATABASE_URL: process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/noteful-test',
}