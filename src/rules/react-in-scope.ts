/**
 * @fileoverview Prevent missing React when using JSX
 * @author Glen Mailer
 */

'use strict';

import {variablesInScope, findVariable} from '../util/variable';
import {getFromContext} from '../util/pragma';

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

export = {
	meta: {
		fixable: true,
		docs: {
			description: 'Prevent missing React when using JSX',
			category: 'Possible Errors',
			recommended: true,
		},
		schema: [],
	},

	create(context): any {
		const alreadyReported = {};
		const pragma = getFromContext(context);
		const NOT_DEFINED_MESSAGE = "'{{name}}' must be in scope when using JSX";

		function checkIfReactIsInScope(node): void {
			const filename = context.getFilename();
			const variables = variablesInScope(context);
			if (findVariable(variables, pragma)) {
				return;
			}
			if (alreadyReported[filename]) {
				return;
			}
			alreadyReported[filename] = true;
			const sourceCode = context.getSourceCode();
			context.report({
				node,
				message: NOT_DEFINED_MESSAGE,
				data: {
					name: pragma,
				},
				fix: (fixer) => {
					return fixer.insertTextBefore(
						sourceCode.ast,
						'import React from "react";\n'
					);
				},
			});
		}

		return {
			JSXOpeningElement: checkIfReactIsInScope,
			JSXOpeningFragment: checkIfReactIsInScope,
		};
	},
};
