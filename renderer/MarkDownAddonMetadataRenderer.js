class MarkDownAddonMetadataRenderer {
    /**
     *
     * @param addonMetadata AddonMetadata
     */
    render(addonMetadata) {

        const lines = [
            `# ${addonMetadata.addonSettings.name}`,
            `**Type:** ${addonMetadata.addonType}`,
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
            `## Actions`,
            ``,
            `| Name | Description | Parameters |`,
            `|------|-------------|------------|`,
            ...this.renderActionRows(addonMetadata),
            ``,
            `## Expressions`,
            ``,
            `| Name | Type | Description | Parameters |`,
            `|------|------|-------------|------------|`,
            ...this.renderExpressionRows(addonMetadata),
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
        const actionsByCategory = MarkDownAddonMetadataRenderer.categorize(addonMetadata.actions);
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

    renderExpressionRows(addonMetadata){
        const expressionsByCategory = MarkDownAddonMetadataRenderer.categorize(addonMetadata.expressions);
        const rows = [];
        const addonName = addonMetadata.addonSettings.name;
        const owner = addonMetadata.addonType === "Plugin" ? addonName : `MyObject.${addonName}` ;

        Object.entries(expressionsByCategory).forEach(([category, expressions])=> {
            rows.push(`| | |**${category}**| |`);
            expressions.forEach(expression => {
                const parameters = this.renderParameters(expression.parameters);
                const usageParameters = expression.parameters.length > 0 ? `(${','.repeat(expression.parameters.length)})` : '';
                const expressionUsage = `${owner}.${expression.method}${usageParameters}`;
                rows.push(`|**${expression.name}**<br/>**Usage:** ${this.quoteAsCode(expressionUsage)}|${this.quoteAsCode(expression.returnType)}| ${expression.description} | ${parameters} |`);
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

    static categorize(entries){
        return entries.reduce((dictionary, entry) => {
            if(dictionary[entry.category] === undefined){
                dictionary[entry.category] = [];
            }
            dictionary[entry.category].push(entry);
            return dictionary;
        }, {});
    }
}

module.exports = MarkDownAddonMetadataRenderer;