/**
 * @fileoverview Rule to flag references to undeclared variables.
 * @author Mark Macdonald
 */
'use strict';

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks if the given node is the argument of a typeof operator.
 * @param {ASTNode} node The AST node being checked.
 * @returns {boolean} Whether or not the node is the argument of a typeof operator.
 */
function hasTypeOfOperator(node): boolean {
	const {parent} = node;

	return parent.type === 'UnaryExpression' && parent.operator === 'typeof';
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = {
	meta: {
		type: 'problem',
		fixable: true,
		docs: {
			description: 'Automatically imports stuff that you specify',
			category: 'Variables',
			recommended: true,
			url: 'https://eslint.org/docs/rules/no-undef'
		},

		schema: [
			{
				type: 'object',
				properties: {
					imports: {
						type: 'object',
						default: {}
					}
				},
				additionalProperties: false
			}
		]
	},

	create(context): any {
		const options = context.options[0] || {};
		const considerTypeOf = (options && options.typeof === true) || false;

		const map = options.imports || {};

		return {
			'Program:exit'(/* node */): void {
				const globalScope = context.getScope();
				const sourceCode = context.getSourceCode();

				if (Object.keys(map).length === 0) {
					context.report({
						node: sourceCode.ast,
						data: sourceCode.ast,
						message:
							'Rule tenx/auto-import is enabled but there are no replacements specified. Get started by specifying an object as an option to the ESLint rule: ["error", {imports: {sortBy: `import sortBy from "lodash/sortBy"`}}]'
					});
					return;
				}

				globalScope.through.forEach(ref => {
					const {identifier} = ref;

					if (!considerTypeOf && hasTypeOfOperator(identifier)) {
						return;
					}
					context.report(
						Object.assign(
							{
								node: identifier,
								data: identifier,
								message: `'${
									identifier.name
								}' is not defined. Run --fix to add \`${map[identifier.name]}\``
							},
							map[identifier.name]
								? {
										fix: (fixer): any => {
											return fixer.insertTextBefore(
												sourceCode.ast,
												map[identifier.name] + '\n'
											);
										}
								  }
								: {}
						)
					);
				});
			}
		};
	}
};
