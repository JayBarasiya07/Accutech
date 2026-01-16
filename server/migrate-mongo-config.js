// migrate-mongo-config.cjs
module.exports = {
  mongodb: {
    url: "mongodb+srv://jaybarasiya6:J18062003@cluster0.sjsz9xh.mongodb.net/", // your MongoDB URL
    databaseName: "AccutechDB",       // your DB name
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
};
