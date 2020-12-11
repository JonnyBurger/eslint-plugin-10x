import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/auto-import';

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true,
	},
	parserOptions: {
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
});

ruleTester.run('tenx/auto-import', rule, {
	invalid: [
		{
			code: 'const Container = styled.div``',
			errors: [
				{
					message:
						'\'styled\' is not defined. Run --fix to add `import styled from "styled-components";`',
				},
			],
			options: [
				{
					imports: {
						styled: 'import styled from "styled-components";',
					},
				},
			],
			output:
				'import styled from "styled-components";\nconst Container = styled.div``',
		},
		{
			code: 'const Container = styled.div``',
			errors: [
				{
					message:
						'\'styled\' is not defined. Run --fix to add `import styled from "polished";`',
				},
			],
			options: [
				{
					imports: {
						styled: 'import styled from "polished";',
					},
				},
			],
			output: 'import styled from "polished";\nconst Container = styled.div``',
		},
		{
			code: 'export default () => <View></View>',
			errors: [
				{
					message:
						'\'View\' is not defined. Run --fix to add `import {View} from "react-native";`',
				},
			],
			options: [
				{
					imports: {
						View: 'import {View} from "react-native";',
					},
				},
			],
			output:
				'import {View} from "react-native";\nexport default () => <View></View>',
		},
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
						styled: 'import styled from "styled-components";',
					},
				},
			],
		},
	],
});
