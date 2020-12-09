const MongoLib = require('../lib/mongo');
const { config } = require('../config/');
const PAGE_SIZE = parseInt(config.pageSize);

class CharactersService{
    constructor(){
        this.client = new MongoLib();
        this.pageSize = PAGE_SIZE;
        this.collection = 'characters';
    }

    async getCharacterById(id){
        const idArray = id.replace('[','').replace(']','').split(',').map(val => parseInt(val));
        const characterData = await this.client.getById(this.collection,idArray);
        return characterData;
    }

    async getAllMatchesInPage(){
        let {page, name, genre, nacionality, age, ageB, ageE } = query;
        let prepareQuery = {};

        page = (page && page>1)? page : 1;
        name && (prepareQuery.name = new RegExp(`^${name}.*`));
        genre && (prepareQuery.genre = genre);
        nacionality && (prepareQuery.nacionality = { '$all': nacionality.replace('[','').replace(']','').split(',').map(val => val.trim()) });
        if(age){
            prepareQuery.age = parseInt(age);
        }else if(ageB || ageE){
            prepareQuery.age['$gte'] = parseInt(ageB);
            prepareQuery.age['$lte'] = parseInt(ageE);
        }

        //---
        const characterDataArray = await this.client.getAllMatchesInPage(this.collection,prepareQuery,page-1);
        const count = await this.getTotalCharacters(prepareQuery);
        const next = (count-(this.pageSize*page))>0? `${url}/${this.collection}${this.ObjectToQueryString(prepareQuery)}&page=${page+1}` : null;
        const prev = (page===1)? null : `${url}/${this.collection}${this.ObjectToQueryString(prepareQuery)}&page=${page-1}`;
        const pageResults = {
            "info":{
                "count": count,
                "pages": Math.ceil(count/this.pageSize),
                next,
                prev,
            },
            "reults": characterDataArray,
        }
        //---
        
        return pageResults;
    }

    async insertCharacter(characterSchema){
        const id = await this.getTotalStands();
        const { insertedId } = await this.client.insert(this.collection,{ id: ++id ,...characterSchema });
        return { id, insertedId };
    }

    async updateCharacter(id, characterSchema){
        const modifiedCount = await this.client.update(this.collection,parseInt(id),characterSchema);
        return { id, modifiedCount };
    }

    async deleteCharacter(id){
        const { deletedCount } = await this.client.delete(this.collection,parseInt(id));
        return { id, deletedCount };
    }

    async getTotalCharacters(query = {}){
        const totalCharacters = await this.client.getTotalDocuments(this.collection,query);
        return totalCharacters;
    }

    ObjectToQueryString(ObjectQuery){
        return `?${Object
                    .keys(ObjectQuery)
                    .map( (key) => `${key}=${ObjectQuery[key]}`)
                    .join('&')}`;
    }
}

module.exports = CharactersService;