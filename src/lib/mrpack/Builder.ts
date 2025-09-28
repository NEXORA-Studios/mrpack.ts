import JSZip from "jszip";
import type { IIndexJsonObject } from "../../types";
import type { Override } from "../../components";

export class MrpackBuilder {
    private _indexJson: IIndexJsonObject;
    private _overrides: Override[] = [];

    constructor(indexJson: IIndexJsonObject) {
        this._indexJson = indexJson;
    }

    public addOverride(override: Override): void {
        this._overrides.push(override);
    }

    public async build() {
        const zip = new JSZip();

        zip.file("modrinth.index.json", JSON.stringify(this._indexJson, null, 0));

        for (const override of this._overrides) {
            zip.file(override.filePath, await override.asyncMarshaledContent);
        }

        return await zip.generateAsync({ type: "nodebuffer" });
    }
}
