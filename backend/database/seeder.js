const fs = require("fs");
const ErrorClass = require("../app/utils/ErrorClass");
const CatchAsync = require("../app/utils/CatchAsync");

const insertData = CatchAsync.CatchAsync(async (fileDirectory, dataModel) => {
  //Read JSON Files
  const data = JSON.parse(fs.readFileSync(fileDirectory, "utf-8"));

  await dataModel.create(data);
  process.exit();
});

module.exports = insertData;
