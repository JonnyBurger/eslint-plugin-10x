import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/auto-import';

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

ruleTester.run('tenx/auto-import', rule, {
	invalid: [
		{
			code: 'const Container = styled.div``',
			errors: [
				{
					ruleId: 'tenx/auto-import',
					message:
						'\'styled\' is not defined. Run --fix to add `import styled from "styled-components";`'
				}
			],
			options: [
				{
					imports: {
						styled: 'import styled from "styled-components";'
					}
				}
			],
			output:
				'import styled from "styled-components";\nconst Container = styled.div``'
		},
		{
			code: 'const a = "hi"',
			errors: [
				{
					ruleId: 'tenx/auto-import',
					message:
						'Rule tenx/auto-import is enabled but there are no replacements specified. Get started by specifying an object as an option to the ESLint rule: ["error", {imports: {sortBy: `import sortBy from "lodash/sortBy"`}}]'
				}
			],
			options: [
				{
					imports: {}
				}
			],
			output: 'const a = "hi"'
		},
		{
			code: 'const Container = styled.div``',
			errors: [
				{
					ruleId: 'tenx/auto-import',
					message:
						'\'styled\' is not defined. Run --fix to add `import styled from "polished";`'
				}
			],
			options: [
				{
					imports: {
						styled: 'import styled from "polished";'
					}
				}
			],
			output: 'import styled from "polished";\nconst Container = styled.div``'
		}
	],
	valid: [
		{
			code: `
        import styled from 'styled-components';
        const Container = styled.div;
    `,
			options: [
				{
					imports: {
						styled: 'import styled from "styled-components";'
					}
				}
			]
		}
	]
});
