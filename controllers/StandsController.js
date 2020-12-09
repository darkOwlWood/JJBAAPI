const StandsService = require('../services/StandsService');

class StandController{
    constructor(){
        this.standsService = new StandsService();
        this.init();
    }

    init(){
        this.getAllStands = this.getAllStands.bind(this);
        this.getStandById = this.getStandById.bind(this);
        this.insertStand  = this.insertStand.bind(this);
        this.updateStand  = this.updateStand.bind(this);
        this.deleteStand  = this.deleteStand.bind(this);
    }
    
    async getStandById(req, res, next){
        const { id } = req.params;
        try{
            const standData = await this.standsService.getStandById(id);
            res.json(standData);
        }catch(err){
            next(err);
        }
    }

    async getAllStands(req, res, next){
        const { query, protocol } = req;
        try{
            const url = `${protocol}://${req.get('host')}`;
            const standsDataArray = await this.standsService.getAllMatchesInPage(url,query);
            res.json(standsDataArray);
        }catch(err){
            next(err);
        }
    }

    async insertStand(req, res, next){
        const { body } = req;
        try{
            const insertedId = await this.standsService.insertStand(body);
            res.status(201).json(insertedId);
        }catch(err){
            next(err);
        }
    }

    async updateStand(req, res, next){
        const { body,  params:{ id } } = req;
        try{
            const updatedId = await this.standsService.updateStand(id, body);
            res.status(200).json(updatedId);
        }catch(err){
            next(err);
        }
    }

    async deleteStand(req, res, next){
        const { id } = req.params;
        try{
            const deletedId = await this.standsService.deleteStand(id);
            res.status(200).json(deletedId);
        }catch(err){
            next(err);
        }
    }

}

module.exports = StandController;