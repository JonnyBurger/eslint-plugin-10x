## eslint-plugin-10x

This plugins allows you to define a whitelist of symbols, that if they are undefined, ESLint will automatically import when you have autofixing enabled in your editor.

## Installation

```console
npm i eslint-plugin-10x
```

## Usage

Add it to your `.eslintrc`:

```json
{
	"plugins": ["10x"],
	"rules": {
		"10x/auto-import": [
			"error",
			{
				"imports": {
					"useRef": "import {useRef} from 'react'",
					"useEffect": "import {useEffect} from 'react'",
					"useState": "import {useState} from 'react'",
					"useCallback": "import {useCallback} from 'react'"
				}
			}
		]
	}
}
```

## Tips

Use this plugin in conjunction with [`prettier-plugin-organize-imports`](https://www.npmjs.com/package/prettier-plugin-organize-imports) and it will automatically merge two imports from the same library into one.

## License

MIT

## Author

© 2021 Jonny Burger
