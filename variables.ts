export const uri =
  process.env.NODE_ENV === 'development'
    ? 'mongodb://localhost:27017/companyDB'
    : process.env.NODE_ENV === 'production'
    ? 'remote-db'
    : 'mongodb://localhost:27017/companyDBtests';
