const CharactersService = require('../services/CharactersService');

class CharactersController{
    constructor(){
        this.charactersService = new CharactersService();
        this.init();
    }
    
    init(){        
        this.getAllCharacters  = this.getAllCharacters.bind(this);
        this.getCharactersById = this.getCharactersById.bind(this);
        this.insertCharacter   = this.insertCharacter.bind(this);
        this.updateCharacter   = this.updateCharacter.bind(this);
        this.deleteCharacter   = this.deleteCharacter.bind(this);
    }

    async getCharactersById(req, res, next){
        const { id } = req.params;
        try{
            const characterData = await this.charactersService.getCharacterById(id);
            res.json(characterData);
        }catch(err){
            next(err);
        }
    }

    async getAllCharacters(req, res, next){
        const { query, protocol } = req;
        try{
            const url = `${protocol}://${req.get('host')}`;
            const characterDataArray = await this.charactersService.getAllMatchesInPage(url,query);
            res.json(characterDataArray);
        }catch(err){
            next(err);
        }
    }
    
    async insertCharacter(req, res, next){
        const { body } = req;
        try{
            const insertedId = await this.charactersService.insertCharacter(body);
            res.status(201).json(insertedId);
        }catch(err){
            next(err);
        }
    }
    
    async updateCharacter(req, res, next){
        const { body, params: { id } } = req;
        try{
            const updatedId = await this.charactersService.updateCharacter(id,body);
            res.status(200).json(updatedId);
        }catch(err){
            next(err);
        }
    }
    
    async deleteCharacter(req, res, next){
        const { id } = req.params;
        try{
            const deletedId = await this.charactersService.deleteCharacter(id);
            res.status(200).json(deletedId);
        }catch(err){
            next(err);
        }
    }
}

module.exports = CharactersController;