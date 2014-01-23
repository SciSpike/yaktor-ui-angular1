module.exports = {
  "/page.html": {
    "POST": {
      "type": {
        "properties": {
          "id": {
            "type": "integer"
          },
          "subTypes": {
            "type": "array",
            "items": {
              "$typeRef": "Domain.Entity",
              "type": "integer"
            }
          }
        }
      }
    },
    "GET": {
      "type": {
        "properties": {
          "id": {
            "type": "integer"
          },
          "subTypes": {
            "type": "array",
            "items": {
              "$typeRef": "Domain.Entity",
              "type": "integer"
            }
          }
        }
      }
    },
    "PUT": {
      "type": {
        "properties": {
          "id": {
            "type": "integer"
          },
          "subTypes": {
            "type": "array",
            "items": {
              "$typeRef": "Domain.Entity",
              "type": "integer"
            }
          }
        }
      }
    },
    "FIND": {
      "type": {
        "properties": {
          "id": {
            "type": "integer"
          },
          "subTypes": {
            "type": "array",
            "items": {
              "$typeRef": "Domain.Entity",
              "type": "integer"
            }
          }
        }
      }
    }
  }
}
