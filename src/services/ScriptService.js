const scriptRepository = require('../repositories/ScriptRepository');

class ScriptService {
    async getScripts(filters) {
        return await scriptRepository.findAll(filters);
    }

    async getScriptDetails(id) {
        return await scriptRepository.findById(id);
    }

    async favoriteScript(id) {
        return await scriptRepository.incrementFavorite(id);
    }

    async getReaderData(id) {
        const script = await scriptRepository.findById(id);
        if (!script) throw new Error('Script not found');
        
        return {
            content: script.content,
            stageDirections: script.stageDirections,
            micCues: script.micCues,
            dressCode: script.dressCodeSuggestions
        };
    }
}

module.exports = new ScriptService();
