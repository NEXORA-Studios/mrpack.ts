import type { IFile } from "../types";

export class IndexJsonFile {
    private _file: IFile;

    constructor(path: string, sha1: string, sha512: string, fileSize: number) {
        this._file = {
            path,
            hashes: {
                sha1,
                sha512,
            },
            downloads: [],
            fileSize,
        };
    }

    public addDownloadUri(uri: string): void {
        if (!uri || typeof uri !== 'string') {
            throw new Error('Download URI must be a non-empty string');
        }
        this._file.downloads.push(uri);
    }

    public get marshaledJson(): IFile {
        if (this._file.downloads.length === 0) {
            throw new Error('File object has no download links!');
        }
        return this._file;
    }
}
