export interface DirNode {
    isFile : boolean;
    name : string;
    size : string;
    lastMod : Date;
    children?: DirNode[];
    isLoading? : boolean;
    path? : string;
}