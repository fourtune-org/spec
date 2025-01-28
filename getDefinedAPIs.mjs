import {scandir} from "@aniojs/node-fs-scandir"
import {fileURLToPath} from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function getDefinedAPIs() {
	const map = new Map()
	const entries = await scandir(
		path.join(__dirname, "src", "apis"), {
			sorted: true
		}
	)

	for (const entry of entries) {
		if (entry.type !== "regularFile") continue
		if (entry.parents.length !== 2) continue
		if (!entry.name.startsWith("rev")) continue

		const apiID = entry.parents[0]
		const apiMajorVersion = parseInt(entry.parents[1].slice(1), 10)
		const apiRevision = parseInt(entry.name.slice(3), 10)

		if (!apiID.endsWith("API")) continue

		if (!map.has(apiID)) {
			map.set(apiID, new Map())
		}

		const apiMap = map.get(apiID)

		if (!apiMap.has(apiMajorVersion)) {
			apiMap.set(apiMajorVersion, [])
		}

		apiMap.get(apiMajorVersion).push({
			importPath: `#~src/apis/${entry.relative_path}`,
			importAliasName: `${apiID}_V${apiMajorVersion}_Rev${apiRevision}`,
			revision: apiRevision,
			apiType(definitionType) {
				let code = ``

				code += `DefineAPI<`
				code += `"${apiID}", `
				code += `${apiMajorVersion}, `
				code += `${apiRevision}, `
				code += `${definitionType}`
				code += `>`

				return code
			}
		})
	}

	return map
}
