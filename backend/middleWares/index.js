const bodyParser = require('body-parser');

function bodyParse(){
    return bodyParser.urlencoded({extended:false});
}
module.exports={
    bodyParse,
}