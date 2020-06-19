const fs = require('fs');
const AddonMetadata = require('../addon/AddonMetadata');
const MarkDownAddonMetadataRenderer = require('../renderer/MarkDownAddonMetadataRenderer');

global.ACESDone = function () {
    // TODO: Process ACES.
};

global.ept_integer = 'integer';				// integer number
global.ept_float = 'float';					// floating point number
global.ept_text = 'text';					// text string
global.ept_color = 'color';					// color (as COLORREF bbggrr format)
global.ept_font = 'font';					// font (a string of "facename,size,weight,italic")
global.ept_combo = 'combo';					// dropdown combo box (separate string with | eg. "One|Two|Three")
global.ept_link = 'link';					// hyperlink button

global.pf_singleglobal = 1;			// Plugin can only be inserted as a single global instance
global.pf_texture = (1 << 1);			// Plugin has single texture that can be edited
global.pf_position_aces = (1 << 2);	// Include position (x/y only) related default actions, conditions and expressions
global.pf_size_aces = (1 << 3);		// Include size (w/h only) related default actions, conditions and expressions
global.pf_angle_aces = (1 << 4);		// Include angle ACEs
global.pf_appearance_aces = (1 << 5);	// Set visible etc.
global.pf_tiling = (1 << 6);			// Indicates a plugin which tiles its texture - changes image editor functionality accordingly
global.pf_animations = (1 << 7);		// Plugin uses the animations system
global.pf_zorder_aces = (1 << 8);		// Include layer, send to front etc. actions, conditions and expressions
global.pf_nosize = (1 << 9);			// Prevent resizing
global.pf_effects = (1 << 10);			// Allow effects to be added to the plugin
global.pf_predraw = (1 << 11);			// Must pre-draw when using effects
global.pf_deprecated = (1 << 12);		// Hidden by default

global.ef_none = 0;
global.ef_deprecated = 1;					// still exists and usable in existing projects using it, but hidden from dialog
global.ef_return_number = (1 << 1);		// expression returns integer or float
global.ef_return_string = (1 << 2);		// expression returns string
global.ef_return_any = (1 << 3);			// expression can return any type
global.ef_variadic_parameters = (1 << 4);	// expression accepts any number of any type parameters after those that are defined

global.ept_section = 'section';				// new section

global.cr = {};

global.cr.RGB = function (red, green, blue) {
    const rgbNumber = Math.max(Math.min(red, 255), 0)
        | (Math.max(Math.min(green, 255), 0) << 8)
        | (Math.max(Math.min(blue, 255), 0) << 16);

    return rgbNumber.toString(16);
};

function expresionFlags(flags) {
    let type = "any";

    if (flags & ef_return_string) {
        type = "string";
    }

    if (flags & ef_return_number) {
        type = "number";
    }

    return {
        isNone: flags === ef_none,
        isDeprecated: flags & ef_deprecated,
        isVariadic: flags & ef_variadic_parameters,
        type,
    };
}

function extractMetadata(originFolder) {

    const tempDir = `${process.mainModule.path}/../temp`;
    const originFile = `${originFolder}/edittime.js`;

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    fs.copyFileSync(originFile, `${tempDir}/edittime.js`);

    const addonMetadata = new AddonMetadata();

    function Property(type, name, defaultValue, description, options) {
        addonMetadata.addProperty(type, name, defaultValue, description, options);
    }

    global.cr.Property = Property;

    let currentParams = [];
    let currentComboParamOptions = [];
    
    function AddCmpParam(name, description) {
        currentParams.push({
            type: 'comparison',
            name,
            description,
        });
    }

    function AddNumberParam(name, description, defaultValue) {
        currentParams.push({
            type: 'number',
            name,
            description,
            defaultValue
        });

    }

    function AddStringParam(name, description, defaultValue) {
        currentParams.push({
            type: 'string',
            name,
            description,
            defaultValue
        });
    }

    function AddComboParam(name, description, defaultValue) {
        currentParams.push({
            type: 'combo',
            name,
            description,
            options: currentComboParamOptions,
            defaultValue,
        });
        currentComboParamOptions = [];
    }

    function AddComboParamOption(value){
        currentComboParamOptions.push(value);
    }

    function AddAction(id, flags, name, category, uiHint, description, method) {
        addonMetadata.addAction(id, flags, name, category, uiHint, description, currentParams, method);
        currentParams = [];
        currentComboParamOptions = [];
    }

    function AddExpression(id, flags, name, category, method, description){
        const flagsOptions = expresionFlags(flags);

        addonMetadata.addExpression(id, flags, name, category, description, currentParams, method, flagsOptions.type);
        currentParams = [];
        currentComboParamOptions = [];
    }

    function AddCondition(id, flags, name, category, uiHint, description, method) {
        addonMetadata.addCondition(id, flags, name, category, uiHint, description, currentParams, method);
        currentParams = [];
        currentComboParamOptions = [];
    }

    global.AddAction = AddAction;
    global.AddCondition = AddCondition;
    global.AddExpression = AddExpression;
    global.AddCmpParam = AddCmpParam;
    global.AddNumberParam = AddNumberParam;
    global.AddStringParam = AddStringParam;
    global.AddComboParam = AddComboParam;
    global.AddComboParamOption = AddComboParamOption;

    addonMetadata.settings = require('../temp/edittime');

    return addonMetadata;
}

module.exports = extractMetadata;