export class Colonies {
    jsessionid?: string;
    neighborhood?: Neighborhood;
    serverConfiguration?: string;
}

export class Neighborhood {
    zipcode?: string;
    colonies?: Colony[];
}

export class Colony {
    colony?: string;
    county?: string;
    stateCities?: StateCity[];
}

export class StateCity {
    cities?: string[];
    state?: string;
}