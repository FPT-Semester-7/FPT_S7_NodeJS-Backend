class ScriptDTO {
    constructor(script) {
        this.id = script._id;
        this.title = script.title;
        this.category = script.category;
        this.tone = script.tone;
        this.language = script.language;
        this.wordCount = script.wordCount;
        this.duration = script.duration;
        this.isPremium = script.isPremium;
        this.favoritesCount = script.favoritesCount;
        
        // Detailed fields (optional, can be filtered in reader view)
        this.content = script.content;
        this.stageDirections = script.stageDirections;
        this.micCues = script.micCues;
        this.dressCode = script.dressCodeSuggestions;
    }

    static toSummary(script) {
        return {
            id: script._id,
            title: script.title,
            category: script.category,
            tone: script.tone,
            language: script.language,
            wordCount: script.wordCount,
            duration: script.duration,
            isPremium: script.isPremium
        };
    }
}

module.exports = ScriptDTO;
