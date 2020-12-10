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

    async getAllMatchesInPage(baseUrl,query = {}){
        const { page, prepareQuery } = this.prepareMongoQuery(query);
        const pageResults = await this.getPaginateAnswer(page, baseUrl, query, prepareQuery);

        return pageResults;
    }

    async insertCharacter(baseUrl,characterSchema){
        const id = await this.getTotalStands();
        const url = `${baseUrl}/${id}`;
        const created = new Date();
        const { insertedId } = await this.client.insert(this.collection,{ id: id+1 ,...characterSchema, url, created });
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

    prepareMongoQuery(query){
        let { page, name, genre, nacionality, age } = query;
        let prepareQuery = {};
        
        page = (page && page>1)? page : 1;
        name && (prepareQuery.name = new RegExp(`^${name}.*`));
        genre && (prepareQuery.genre = genre);
        nacionality && (prepareQuery.nacionality = { '$all': nacionality.replace('[','').replace(']','').split(',').map(val => val.trim()) });
        age && (prepareQuery.age = !Array.isArray(age)? parseInt(age) : { '$gte':parseInt(age[0]), '$lte':parseInt(age[1]) });

        return { page, prepareQuery };
    }

    async getPaginateAnswer(page, baseUrl, query, prepareQuery){
        let pageResults = {};
        const count = await this.getTotalCharacters(prepareQuery);
        const pages = Math.ceil(count/this.pageSize);

        if(page<=pages){
            const characterDataArray = await this.client.getAllMatchesInPage(this.collection,prepareQuery,page-1);
            const fullUrl = this.getFullUrl(baseUrl,query);
            const { prev, next } = this.getPrevAndNextUrls(page,count,fullUrl,prepareQuery);
            pageResults = {
                "info":{ count, pages, next, prev },
                "reults": characterDataArray,
            }
        }else{
            pageResults = { 'error': 'There is nothing here' };
        }

        return pageResults
    }

    getPrevAndNextUrls(page,count,fullUrl){
        const next = (count-(this.pageSize*page))>0? `${fullUrl}page=${page+1}` : null;
        const prev = (page===1)? null : `${fullUrl}page=${page-1}`;

        return { prev, next };
    } 

    getFullUrl(baseUrl,query){
        let { name, genre, nacionality, age } = query;
        let fullUrl = `${baseUrl}?`;
        
        name && (fullUrl += `name=${name}&`);
        genre && (fullUrl += `genre=${genre}&`);
        nacionality && (fullUrl += `nacionality=[${nacionality}]&`);
        age && (fullUrl += `age=[${age}]&`);

        return fullUrl;
    }
}

module.exports = CharactersService;