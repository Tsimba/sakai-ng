export class Page<T> {

    private _content = new Array<T>();
    private _totalPages:number = 0;
    private _totalElements:number = 0;
    private _size:number = 10;
    private _number:number = 0;
    private _sorts = new Array<String>();


    get content(): T[] {
        return this._content;
    }

    set content(value: T[]) {
        this._content = value;
    }

    get totalPages(): number {
        return this._totalPages;
    }

    set totalPages(value: number) {
        this._totalPages = value;
    }

    get totalElements(): number {
        return this._totalElements;
    }

    set totalElements(value: number) {
        this._totalElements = value;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    get number(): number {
        return this._number;
    }

    set number(value: number) {
        this._number = value;
    }

    get sorts(): String[] {
        return this._sorts;
    }

    set sorts(value: String[]) {
        this._sorts = value;
    }
}