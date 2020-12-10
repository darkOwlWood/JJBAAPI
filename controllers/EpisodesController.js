const EpisodeService = require('../services/EpisodesService');

class EpisodesController{
    constructor(){
        this.route = 'episodes';
        this.episodeService = new EpisodeService();
        this.init();
    }

    init(){
        this.getEpisodeById = this.getEpisodeById.bind(this);
        this.getAllEpisodes = this.getAllEpisodes.bind(this);
        this.insertEpisode  = this.insertEpisode.bind(this);
        this.updateEpisode  = this.updateEpisode.bind(this);
        this.deleteEpisode  = this.deleteEpisode.bind(this);
    }

    async getEpisodeById(req, res, next){
        const { id } = req.params;
        try{
            const episodeData = await this.episodeService.getEpisodeById(id);
            res.json(episodeData);
        }catch(err){
            next(err);
        }
    }

    async getAllEpisodes(req, res, next){
        const { query, protocol } = req;
        try{
            const url = `${protocol}://${req.get('host')}/${this.route}`;
            const episodesDataArray = await this.episodeService.getAllMatchesInPage(url,query);
            res.json(episodesDataArray);
        }catch(err){
            next(err);
        }
    }

    async insertEpisode(req, res, next){
        const { body, protocol } = req;
        try{
            const url = `${protocol}://${req.get('host')}/${this.route}`;
            const insertedId = await this.episodeService.insertEpisode(url,body);
            req.status(201).json(insertedId);
        }catch(err){
            next(err);
        }
    }
    
    async updateEpisode(req, res, next){
        const { body, params: { id } } = req;
        try{
            const updatedId = await this.episodeService.updateEpisode(id,body);
            res.status(200).json(updatedId);
        }catch(err){
            next(err);
        }
    }
    
    async deleteEpisode(req, res, next){
        const { id } = req.params;
        try{
            const deletedId = await this.episodeService.deleteEpisode(id);
            res.status(200).json(deletedId);
        }catch(err){
            next(err);
        }
    }
}

module.exports = EpisodesController;