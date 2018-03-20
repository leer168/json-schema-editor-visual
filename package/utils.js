const JSONPATH_JOIN_CHAR = '.';
exports.JSONPATH_JOIN_CHAR = JSONPATH_JOIN_CHAR;
exports.lang = 'en_US'
const _ = require('underscore');
exports.SCHEMA_TYPE = ['string', 'number', 'array', 'object', 'boolean', 'integer'];
exports.defaultSchema = {
  string: {
    type: 'string'
  },
  number: {
    type: 'number'
  },
  array: {
    type: 'array',
    items: {
      type: 'string'
    }
  },
  object: {
    type: 'object',
    properties: {}
  },
  boolean: {
    type: 'boolean'
  },
  integer: {
    type: 'integer'
  }
};



function getData(state, keys) {
  let curState = state;
  for (let i = 0; i < keys.length; i++) {
    curState = curState[keys[i]];
  }
  return curState;
}

exports.getData = getData;

exports.setData = function(state, keys, value) {
  let curState = state;
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]];
  }

  curState[keys[keys.length - 1]] = value;
};

exports.getParentKeys = function(keys) {
  if (keys.length === 1) return [];
  let arr = [].concat(keys);
  arr.splice(keys.length - 1, 1);
  return arr;
};

exports.clearSomeFields = function(keys, data) {
  const newData = Object.assign({}, data);
  keys.forEach(key => {
    delete newData[key];
  });
  return newData;
};

function getFieldsName (data) {
  const requiredName = [];
  Object.keys(data).map(name => {
    requiredName.push(name)
  })

  return requiredName;
}



function handleSchemaRequired(schema, checked) {

  
  // console.log(schema)
  if (schema.type === "object") {
    let requiredName = getFieldsName(schema.properties);
    
    schema.required = checked ? [].concat(requiredName) : []
    
    // schema.required = 
    // schema = Object.assign({},schema, {required})
    handleObject(schema.properties, checked);
  }else if (schema.type === "array") {
    
    handleSchemaRequired(schema.items, checked);
  }else{
    return schema
  }
}

function handleObject(properties, checked) {
  for (var key in properties) {
    if(properties[key].type === 'array' || properties[key].type === 'object')
    handleSchemaRequired(properties[key], checked);
  }
}

exports.handleSchemaRequired = handleSchemaRequired;

function cloneObject (obj) {
  if(typeof obj === "object") {
      if(_.isArray(obj)) {
          var newArr = [];
          newArr =[].concat(obj);
          return newArr;
      } else {
          var newObj = {};
          for(var key in obj) {
              newObj[key] = cloneObject(obj[key]);
          }
          return newObj;
      }
  } else {
      return obj;
  }
};

exports.cloneObject = cloneObject;


