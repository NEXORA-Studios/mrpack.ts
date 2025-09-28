export interface IFile {
    path: string;
    hashes: {
        sha1: string;
        sha512: string;
    };
    downloads: string[];
    fileSize: number;
}
