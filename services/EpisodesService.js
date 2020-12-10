const MongoLib = require('../lib/mongo');
const { config } = require('../config');
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

    async getAllMatchesInPage(url,query = {}){
        let {page, name, episode, anime, part, code} = query;
        let prepareQuery = {};

        page = (page && page>1)? page : 1;
        name && (prepareQuery.name = new RegExp(`^${name}.*`));
        episode && (prepareQuery.code = episode);
        anime && (prepareQuery['anime.name'] = anime);
        part && (prepareQuery['anime.part'] = part);
        code && (prepareQuery['anime.code'] = code);

        //---
        const episodesDataArray = await this.client.getAllMatchesInPage(this.collection,prepareQuery,page-1);
        const count = await this.getTotalEpisodes(prepareQuery);
        const next = (count-(this.pageSize*page))>0? `${url}/${this.collection}${this.ObjectToQueryString(prepareQuery)}&page=${page+1}` : null;
        const prev = (page===1)? null : `${url}/${this.collection}${this.ObjectToQueryString(prepareQuery)}&page=${page-1}`;
        const pageResults = {
            "info":{
                "count": count,
                "pages": Math.ceil(count/this.pageSize),
                next,
                prev,
            },
            "reults": episodesDataArray,
        }
        //---
        
        return pageResults;
    }

    async insertEpisode(episodeSchema){
        const id = await this.getTotalEpisodes();
        const { insertedId } = await this.client.insert(this.collection,{ id: ++id ,...episodeSchema });
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

module.exports = EpisodesService;