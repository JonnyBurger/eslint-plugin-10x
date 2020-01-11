import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/react-in-scope';

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	},
	parserOptions: {
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	}
});

ruleTester.run('10x/react-in-scope', rule, {
	invalid: [
		{
			code: 'export default () => <div></div>',
			errors: [
				{
					ruleId: '10x/react-in-scope',
					message: "'React' must be in scope when using JSX"
				}
			],
			output: 'import React from "react";\nexport default () => <div></div>'
		}
	],
	valid: ['import React from "react";\nexport default () => <div></div>']
});
