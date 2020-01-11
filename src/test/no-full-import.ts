import test from 'ava';
import rule from '../rules/no-full-import';

const avaRuleTester = require('eslint-ava-rule-tester');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	},
	parserOptions: {
		sourceType: 'module'
	}
});

// @ts-ignore
ruleTester.run('small-import/forbid-native-components', rule, {
	invalid: [
		{
			code: 'import {max} from "lodash"',
			errors: [
				{
					ruleId: 'small-import/forbid-native-components',
					message:
						'Import only this function instead of the whole lodash package'
				}
			],
			output: 'import max from "lodash/max";'
		},
		{
			code: 'import {max} from "underscore"',
			options: [{packages: {underscore: '/'}}],
			errors: [
				{
					ruleId: 'small-import/forbid-native-components',
					message:
						'Import only this function instead of the whole underscore package'
				}
			],
			output: 'import max from "underscore/max";'
		},
		{
			code: 'import {startOfDay} from "date-fns"',
			errors: [
				{
					ruleId: 'small-import/forbid-native-components',
					message:
						'Import only this function instead of the whole date-fns package'
				}
			],
			output: 'import startOfDay from "date-fns/startOfDay";'
		},
		{
			code: 'import {sortBy, groupBy, max} from "lodash"',
			errors: [
				{
					ruleId: 'small-import/forbid-native-components',
					message:
						'Import only this function instead of the whole lodash package'
				}
			],
			output:
				'import sortBy from "lodash/sortBy";\nimport groupBy from "lodash/groupBy";\nimport max from "lodash/max";'
		}
	],
	valid: [
		'import {Text} from "react-native-normalized"',
		'import {View} from "react-native"',
		'import {Image} from "got"',
		'import {View, TouchableOpacity, Keyboard} from "react-native";',
		`
			import {Text, Image} from 'react-native-normalized';
			import {StyleSheet} from 'react-native'
		`,
		`
			import {StyleSheet} from 'react-native'
			import {Text, Image} from 'react-native-normalized';
		`,
		`
			const {StyleSheet} = require('react-native')
			const {Text, Image} = require('react-native-normalized');
		`,
		`
			HudManager.setHudContent({
				icon: require('./assets/clear.png'),
				label: strings.COULD_NOT_VOTE
			});
		`,
		`
			'use strict';
			import {AsyncStorage} from 'react-native';
		`,
		`
			import React, {Component, ReactElement} from 'react';
			import {Text, ActivityIndicator} from 'react-native-normalized';
			import {StyleSheet, View, Platform} from 'react-native';
		`
	]
});
