class AddonMetadata {
    constructor(){
        this.addonType = '';
        this.addonSettings = {};
        this.properties = [];
        this.actions = [];
        this.conditions = [];
        this.expressions = [];
    }

    addProperty(type, name, defaultValue, description, options){
        this.properties.push({ type, name, defaultValue, description, options });
    }

    addAction(id, flags, name, category, uiHint, description, parameters, method){
        this.actions.push({
            id, flags, name, category, uiHint, description, parameters, method
        });
    }

    addExpression(id, flags, name, category, description, parameters, method, returnType){
        this.expressions.push({id, flags, name, category, description, parameters, method, returnType});
    }

    addCondition(id, flags, name, category, uiHint, description, parameters, method){
        this.conditions.push({
            id, flags, name, category, uiHint, description, parameters, method
        });
    }

    set settings ({ settings, type }){
        this.addonType = type;
        this.addonSettings = settings;
    }
}

module.exports = AddonMetadata;