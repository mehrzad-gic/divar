const express = require('express');
const ApiRoutes = express();


/**  
 * @swagger  
 *  /test:  
 *      get:   
 *          summary: Test endpoint  
 *          description: This endpoint is for testing purposes.  
 *          tags:   
 *              - test   
 *          responses:  
 *              200:  
 *                  description: success  
 */  
ApiRoutes.get('/test', (req, res) => {  
    res.send('api test');  
});  

/**  
 * @swagger  
 *  /test2:  
 *      get:   
 *          summary: Test2 endpoint  
 *          description: This is a second test endpoint.  
 *          tags:   
 *              - test   
 *          responses:  
 *              200:  
 *                  description: success  
 */  
ApiRoutes.get('/test2', (req, res) => {  
    res.send('api test2');  
});  

module.exports = ApiRoutes;