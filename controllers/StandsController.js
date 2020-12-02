const MongoLib = require('../lib/mongo');

class StandController{
    constructor(){
        this.client = new MongoLib();
        this.init();
    }

    init(){
        this.insertStand = this.insertStand.bind(this);
    }

    insertStand(req, res, next){
        const { body } = req;
        try{
            this.client.create('stands',body);
            res.send('The data was created');
        }catch(err){
            res.send('Error');
        }
    }
}

module.exports = StandController;