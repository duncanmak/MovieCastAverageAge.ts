import request = require('request');
import url = require('url');
import _ = require('underscore');

export class TMDB {
    static URL = "http://api.themoviedb.org/3/";
    thisYear: number;

    private URL(method: string): string {
        return url.resolve(TMDB.URL, method);
    }

    constructor(public api_key: string) {
        this.thisYear = new Date().getFullYear();
    }

    getAge(name: string, callback: (age: number) => any) {
        this.getID(name, id => {
            request.get(
                { url: this.URL("person/" + id), json: true, qs: { api_key: this.api_key } },
                (error, response, body) => {
                    var age = this.thisYear - new Date(body["birthday"]).getFullYear();
                    callback(age);
                });
        });
    }

    getID(name: string, callback: (id: number) => any) {
        request.get(
            { url: this.URL("search/person"), json: true, qs: { api_key: this.api_key, query: name } },
            (error, response, body) => {
                if (_.isEmpty(body["results"]) == false) {
                    var id = body["results"][0]["id"];
                    callback(id);
                }
            });
    }
}
