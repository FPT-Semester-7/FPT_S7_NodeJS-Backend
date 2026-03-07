class ResourceDTO {
    constructor(resource) {
        this.id = resource._id;
        this.title = resource.title;
        this.type = resource.type;
        this.fileUrl = resource.fileUrl;
        this.fileSize = resource.fileSize;
        this.version = resource.version;
        this.description = resource.description;
    }
}

module.exports = ResourceDTO;
