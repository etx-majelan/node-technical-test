export default class SortDTO {
    property: string;
    direction: "ASC" | "DESC";

    constructor(property: string, direction: string) {      
        this.property = property;
        this.direction = direction.toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
    }
}