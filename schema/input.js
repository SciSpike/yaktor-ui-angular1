
var inputScheme = {
 "id": "/SimpleAddress",
 "type": "object",
 "properties": {
   "lines": {
     "type": "array",
     "items": {"type": "string"}
   },
   "zip": {"type": "string"},
   "city": {"type": "string"},
   "country": {"type": "string", "required": true}
 }
};

module.exports = inputScheme;