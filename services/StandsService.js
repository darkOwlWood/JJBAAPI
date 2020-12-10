const MongoLib = require('../lib/mongo');
const { config } = require('../config');
const PAGE_SIZE = parseInt(config.pageSize);

class StandsService{
    constructor(){
        this.client = new MongoLib();
        this.pageSize = PAGE_SIZE;
        this.collection = 'stands';
        this.stats = ['destructivePower','speed','range','powerPersistence','precision','developmentalPotential'];
    }

    async getStandById(id){
        const idArray = id.replace('[','').replace(']','').split(',').map(val => parseInt(val));
        const standData = await this.client.getById(this.collection,idArray);
        return standData;
    }

    async getAllMatchesInPage(baseUrl,query = {}){
        const { page, prepareQuery } = this.prepareMongoQuery(query);
        const pageResults = await this.getPaginateAnswer(page, baseUrl, query, prepareQuery);

        return pageResults;
    }

    async insertStand(standSchema){
        const id = await this.getTotalStands();
        const { insertedId } = await this.client.insert(this.collection,{ id: ++id ,...standSchema });
        return { id, insertedId };
    }

    async updateStand(id, standSchema){
        const modifiedCount = await this.client.update(this.collection,parseInt(id),standSchema);
        return { id, modifiedCount };
    }

    async deleteStand(id){
        const { deletedCount } = await this.client.delete(this.collection,parseInt(id));
        return { id, deletedCount };
    }

    async getTotalStands(query = {}){
        const totalStands = await this.client.getTotalDocuments(this.collection,query);
        return totalStands;
    }

    lowerCamelCaseToSnakeCase(string){
        return string
                .split(/([A-Z])/)
                .map( val => /^[A-Z]$/.test(val)? `_${val.toLowerCase()}` : val )
                .join('');
    }

    prepareMongoQuery(query){
        let {page, name, type, user} = query;
        let prepareQuery = {};

        page = (page && page>1)? page : 1;
        name && (prepareQuery.name = new RegExp(`^${name}.*`));
        user && (prepareQuery['user.name'] = new RegExp(`^${user}.*`));
        type && (prepareQuery['type.name'] = { '$all': type.replace('[','').replace(']','').split(',') });
        this.stats.forEach( stat => {
            query[stat] && (prepareQuery[`stats.${this.lowerCamelCaseToSnakeCase(stat)}`] = query[stat]);
        });

        return { page, prepareQuery };
    }

    async getPaginateAnswer(page, baseUrl, query, prepareQuery){
        let pageResults = {};
        const count = await this.getTotalStands(prepareQuery);
        const pages = Math.ceil(count/this.pageSize);

        if(page<=pages){
            const standDataArray = await this.client.getAllMatchesInPage(this.collection,prepareQuery,page-1);
            const fullUrl = this.getFullUrl(baseUrl,query);
            const { prev, next } = this.getPrevAndNextUrls(page,count,fullUrl,prepareQuery);
            pageResults = {
                "info":{ count, pages, next, prev },
                "reults": standDataArray,
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
        let { name, type, user } = query;
        let fullUrl = `${baseUrl}?`;

        name && (fullUrl += `name=${name}&`);
        user && (fullUrl += `user=${user}&`);
        type && (fullUrl += `type=${type}&`);
        this.stats.forEach( stat => {
            query[stat] && (fullUrl += `${stat}=${query[stat]}&`);
        });

        return fullUrl;
    }
}

module.exports = StandsService;