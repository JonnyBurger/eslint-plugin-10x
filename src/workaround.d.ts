// Can be removed when
// https://github.com/avajs/ava/issues/2332

declare interface SymbolConstructor {
	readonly observable: symbol;
}
