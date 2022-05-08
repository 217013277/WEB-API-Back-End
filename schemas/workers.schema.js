exports.workerSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "/worker",
  "title": "Workers",
  "description": "Store worker id",
  "type": "object",
  "properties": {
    "workerid": {
      "description": "Worker ID",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["workerid"]
}
