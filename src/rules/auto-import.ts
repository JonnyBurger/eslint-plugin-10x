/**
 * @fileoverview Rule to flag references to undeclared variables.
 * @author Mark Macdonald
 */
'use strict';
import {isDOMComponent} from '../util/jsx';

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

const allowGlobals = false;

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

		function checkIdentifierInJSX(node): any {
			let scope = context.getScope();
			const sourceCode = context.getSourceCode();
			const {sourceType} = sourceCode.ast;
			let {variables} = scope;
			let scopeType = 'global';
			let i;
			let len;

			// Ignore 'this' keyword (also maked as JSXIdentifier when used in JSX)
			if (node.name === 'this') {
				return;
			}

			if (!allowGlobals && sourceType === 'module') {
				scopeType = 'module';
			}

			while (scope.type !== scopeType) {
				scope = scope.upper;
				variables = scope.variables.concat(variables);
			}
			if (scope.childScopes.length) {
				variables = scope.childScopes[0].variables.concat(variables);
				// Temporary fix for babel-eslint
				if (scope.childScopes[0].childScopes.length) {
					variables = scope.childScopes[0].childScopes[0].variables.concat(
						variables
					);
				}
			}

			for (i = 0, len = variables.length; i < len; i++) {
				if (variables[i].name === node.name) {
					return;
				}
			}
			const fixable = Boolean(map[node.name]);

			context.report(
				Object.assign(
					{
						node,
						message: [
							`'${node.name}' is not defined.`,
							fixable ? `Run --fix to add \`${map[node.name]}\`` : null
						]
							.filter(Boolean)
							.join(' ')
					},
					map[node.name]
						? {
								fix: (fixer): any => {
									return fixer.insertTextBefore(
										sourceCode.ast,
										map[node.name] + '\n'
									);
								}
						  }
						: {}
				)
			);
		}

		return {
			JSXOpeningElement(node): any {
				switch (node.name.type) {
					case 'JSXIdentifier':
						if (isDOMComponent(node)) {
							return;
						}
						node = node.name;
						break;
					case 'JSXMemberExpression':
						node = node.name;
						do {
							node = node.object;
						} while (node && node.type !== 'JSXIdentifier');
						break;
					case 'JSXNamespacedName':
						node = node.name.namespace;
						break;
					default:
						break;
				}
				checkIdentifierInJSX(node);
			},
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

					const fixable = Boolean(map[identifier.name]);

					context.report(
						Object.assign(
							{
								node: identifier,
								data: identifier,
								message: [
									`'${identifier.name}' is not defined.`,
									fixable
										? `Run --fix to add \`${map[identifier.name]}\``
										: null
								]
									.filter(Boolean)
									.join(' ')
							},
							fixable
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
