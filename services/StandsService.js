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

    async getAllMatchesInPage(url,query = {}){
        let {page, name, type, user} = query;
        let prepareQuery = {};

        page = (page && page>1)? page : 1;
        name && (prepareQuery.name = new RegExp(`^${name}.*`));
        user && (prepareQuery['user.name'] = new RegExp(`^${user}.*`));
        type && (prepareQuery['type.name'] = { '$all': type.replace('[','').replace(']','').split(',') });
        this.stats.forEach( (stat) => {
            query[stat] && (prepareQuery[`stats.${this.lowerCamelCaseToSnakeCase(stat)}`] = query[stat]);
        });

        //---
        const standDataArray = await this.client.getAllMatchesInPage(this.collection,prepareQuery,page-1);
        const count = await this.getTotalStands(prepareQuery);
        const next = (count-(this.pageSize*page))>0? `${url}/${this.collection}${this.ObjectToQueryString(prepareQuery)}&page=${page+1}` : null;
        const prev = (page===1)? null : `${url}/${this.collection}${this.ObjectToQueryString(prepareQuery)}&page=${page-1}`;
        const pageResults = {
            "info":{
                "count": count,
                "pages": Math.ceil(count/this.pageSize),
                next,
                prev,
            },
            "reults": standDataArray,
        }
        //---
        
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

    ObjectToQueryString(ObjectQuery){
        return `?${Object
                    .keys(ObjectQuery)
                    .map( (key) => `${key}=${ObjectQuery[key]}`)
                    .join('&')}`;
    }
}

module.exports = StandsService;