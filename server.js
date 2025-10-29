const app = require("./index");
require("dotenv/config");
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  console.log(`Server started! http://localhost:${PORT}`);
});
