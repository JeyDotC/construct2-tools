class AddonMetadata {
    constructor(){
        this.addonType = '';
        this.addonSettings = {};
        this.properties = [];
        this.actions = [];
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

    // AddExpression(10, ef_return_number, "Far", "Camera", "Far", "The furthest distance an object will be drawn in 3D units.");
    addExpression(id, flags, name, category, description, parameters, method, returnType){
        this.expressions.push({id, flags, name, category, description, parameters, method, returnType});
    }

    set settings ({ settings, type }){
        this.addonType = type;
        this.addonSettings = settings;
    }
}

module.exports = AddonMetadata;