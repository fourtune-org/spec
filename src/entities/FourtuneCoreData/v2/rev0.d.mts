import type {RealmName} from "@fourtune/primitives"

export type Definition = {
	realm: RealmName
	platform: string

	realmDependenciesStamp: string
	realmDependenciesIntegrityHash: string

	realmDependencies: {
		name: string
		importPath: string
		useDefaultImport: boolean
		version: string
		isolated: boolean
	}[]
}
