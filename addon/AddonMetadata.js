class AddonMetadata {
    constructor(){
        this.addonType = '';
        this.addonSettings = {};
        this.properties = [];
        this.actions = [];
    }

    addProperty(type, name, defaultValue, description, options){
        this.properties.push({ type, name, defaultValue, description, options });
    }

    addAction(id, flags, name, category, uiHint, description, parameters){
        this.actions.push({
            id, flags, name, category, uiHint, description, parameters
        });
    }

    set settings ({ settings, type }){
        this.addonType = type;
        this.addonSettings = settings;
    }
}

module.exports = AddonMetadata;