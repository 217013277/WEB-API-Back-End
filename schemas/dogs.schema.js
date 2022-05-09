module.exports = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "/dog",
  "title": "Dogs",
  "description": "Dog in website",
        "type": "object",
        "properties": {
          "name":{
            "description":"Dog Name",
              "type": "string"
          },
          "description":{
            "description":"description of the dog",
              "type": "string"
          },
          "breed":{
            "description":"breed of the dog",
              "type": "string"
          },
          "birthday":{
            "description":"birth date",
              "type": "string"
          },
          "imageURL":{
            "description":"image URL",
              "type": "url"
          },
          "published":{
            "description":"Published",
              "type": "boolean"
          },
          "authorID":{
            "description":"author ID",
              "type": "integer",
              "minimum":0
          }
        },
  "required": ["name", "breed"]
}
