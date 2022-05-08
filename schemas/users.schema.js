exports.userSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "/user",
  "title": "Users",
  "description": "User of the website",
  "type": "object",
  "properties": {
    "firstname": {
      "description": "First name of the user",
      "type": "string"
    },
    "lastname": {
      "description": "Last name of the user",
      "type": "string"
    },
    "username": {
      "description": "Username of the user for login",
      "type": "string"
    },
    "about": {
      "description": "Description of the user",
      "type": "string"
    },
    "password": {
      "description": "Password of the user",
      "type": "string"
    },
    "email": {
      "description": "E-mail of the user",
      "type": "email"
    },
    "avatarurl": {
      "description": "Avatar URL",
      "type": "url"
    },
    "role": {
      "description": "Role of the user",
      "type": "string"
    }
  },
  "required": ["username", "email", "password"]
}
