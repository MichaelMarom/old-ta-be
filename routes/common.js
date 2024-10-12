const { verifyToken } = require("../controllers/auth");
const {
  updateRecord,
  getAllRecords,
  createRecord,
  deleteRecord,
  get_column_by_id,
} = require("../controllers/common");
const { express, parser } = require("../modules");
const COMMON_ROUTERS = express.Router();

COMMON_ROUTERS.put("/:table/:id", parser, updateRecord);

COMMON_ROUTERS.get("/:table/list", getAllRecords);
COMMON_ROUTERS.post("/:table", parser, createRecord);
COMMON_ROUTERS.delete("/:table/:id", parser, deleteRecord);
COMMON_ROUTERS.get(
  "/:tableName/getField/:id",
  verifyToken,
  parser,
  get_column_by_id
);

module.exports = COMMON_ROUTERS;
