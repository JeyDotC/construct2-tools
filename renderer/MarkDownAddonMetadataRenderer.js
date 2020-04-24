class MarkDownAddonMetadataRenderer {
    /**
     *
     * @param addonMetadata AddonMetadata
     */
    render(addonMetadata) {

        const lines = [
            `# ${addonMetadata.addonSettings.name}`,
            ``,
            `${addonMetadata.addonSettings.description}`,
            ``,
            `# Properties`,
            ``,
            `| Name | Type | Description | Options |`,
            `|------|------|-------------|---------|`,
            ...this.renderPropertyRows(addonMetadata),
            ``,
            `# ACES`,
            ``,
            ``,
            `## Actions`,
            ``,
            `| Name | Description | Parameters |`,
            `|------|-------------|------------|`,
            ...this.renderActionRows(addonMetadata),
        ];

        return lines.join('\n');
    }

    renderPropertyRows(addonMetadata){
        return addonMetadata.properties.map(p => {
            if (p.type === 'section') {
                return `| | | **${p.name}**| |`;
            }

            const defaultValue = p.defaultValue ? `Default value: \`${p.defaultValue}\`` : '';
            const options = p.options !== undefined ? p.options.split('|').map(o => `- ${o}`).join('<br/>') : '';
            return `|**${p.name}**| _${p.type}_ | ${p.description} ${defaultValue} | ${options} |`;
        })
    }

    renderActionRows(addonMetadata){
        const actionsByCategory = addonMetadata.actions.reduce((dictionary, action) => {
            if(dictionary[action.category] === undefined){
                dictionary[action.category] = [];
            }
            dictionary[action.category].push(action);
            return dictionary;
        }, {});

        const rows = [];

        Object.entries(actionsByCategory).forEach(([category, actions])=> {
           rows.push(`| |**${category}**| |`);
           actions.forEach(action => {
               const parameters = this.renderParameters(action.parameters);
               rows.push(`|**${action.name}**| ${action.description} | ${parameters} |`);
           });
        });

        return rows;
    }

    quoteAsCode = value => `\`${value}\``;

    renderParameters(parameters){
        return parameters.map(p => {
            const defaultValue = p.defaultValue ? ` = ${this.quoteAsCode(p.defaultValue)}` : '';
            const options = p.options ? ` **Options**: (${p.options.map(this.quoteAsCode).join(', ')})` : '';

            return `- **${p.name}** _${p.type}_${defaultValue}: ${p.description} ${options}`;
        }).join('<br />');
    }
}

module.exports = MarkDownAddonMetadataRenderer;