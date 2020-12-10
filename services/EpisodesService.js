const MongoLib = require('../lib/mongo');
const { config } = require('../config/');
const PAGE_SIZE = parseInt(config.pageSize);

class EpisodesService{
    constructor(){
        this.client = new MongoLib();
        this.pageSize = PAGE_SIZE;
        this.collection = 'episodes';
    }

    async getEpisodeById(id){
        const idArray = id.replace('[','').replace(']','').split(',').map(val => parseInt(val));
        const episodeData = await this.client.getById(this.collection,idArray);
        return episodeData;
    }

    async getAllMatchesInPage(baseUrl,query = {}){
        const { page, prepareQuery } = this.prepareMongoQuery(query);
        const pageResults = await this.getPaginateAnswer(page, baseUrl, query, prepareQuery);

        return pageResults;
    }

    async insertEpisode(baseUrl,episodeSchema){
        const id = await this.getTotalEpisodes();
        const url = `${baseUrl}/${id}`;
        const created = new Date();
        const { insertedId } = await this.client.insert(this.collection,{ id: id+1 ,...episodeSchema, url, created });
        return { id, insertedId };
    }

    async updateEpisode(id, episodeSchema){
        const modifiedCount = await this.client.update(this.collection,parseInt(id),episodeSchema);
        return { id, modifiedCount };
    }

    async deleteEpisode(id){
        const { deletedCount } = await this.client.delete(this.collection,parseInt(id));
        return { id, deletedCount };
    }

    async getTotalEpisodes(query = {}){
        const totalEpisodes = await this.client.getTotalDocuments(this.collection,query);
        return totalEpisodes;
    }

    prepareMongoQuery(query){
        let {page, name, episode, anime, part, code} = query;
        let prepareQuery = {};

        page = (page && page>1)? page : 1;
        name && (prepareQuery.name = new RegExp(`^${name}.*`));
        episode && (prepareQuery.code = episode);
        anime && (prepareQuery['anime.name'] = anime);
        part && (prepareQuery['anime.part'] = part);
        code && (prepareQuery['anime.code'] = code);

        return { page, prepareQuery };
    }

    async getPaginateAnswer(page, baseUrl, query, prepareQuery){
        let pageResults = {};
        const count = await this.getTotalEpisodes(prepareQuery);
        const pages = Math.ceil(count/this.pageSize);

        if(page<=pages){
            const episodeDataArray = await this.client.getAllMatchesInPage(this.collection,prepareQuery,page-1);
            const fullUrl = this.getFullUrl(baseUrl,query);
            const { prev, next } = this.getPrevAndNextUrls(page,count,fullUrl,prepareQuery);
            pageResults = {
                "info":{ count, pages, next, prev },
                "reults": episodeDataArray,
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
        let { name, episode, anime, part, code } = query;
        let fullUrl = `${baseUrl}?`;

        name && (fullUrl += `name=${name}&`);
        episode && (fullUrl += `episode=${episode}&`);
        anime && (fullUrl += `anime=${anime}&`);
        part && (fullUrl += `part=${part}&`);
        code && (fullUrl += `code=${code}&`);
        
        return fullUrl;
    }
}

module.exports = EpisodesService;