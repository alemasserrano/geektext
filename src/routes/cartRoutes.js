const express = require('express');
const cartRouter = express.Router();


function router(nav){

    cartRouter.route('/')
        .get((req,res) =>{
            
            
                res.render(
                    'cartView',
                    {
                        nav, 
                        title: 'Cart'
                    }
                
                );
         
        });
return cartRouter;
}

    
    
module.exports = router;