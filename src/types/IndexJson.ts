import type { IDependencies, IFile } from ".";

export interface IIndexJsonObject {
    game: "minecraft";
    formatVersion: 1;
    name: string;
    version: string;
    summary: string;
    dependencies: IDependencies;
    files: IFile[];
}
