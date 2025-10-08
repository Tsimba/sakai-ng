import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '@/models/client';

@Injectable({ providedIn: 'root' })
export class ClientService {

    protected url:string = environment.hubApiURL;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(
        private http: HttpClient
    ) {}


    deleteClient(client: Client): Observable<any>{
        console.log("DELETE SERVICE")
        return  this.http.delete(this.url + "/v1/client/delete/"+ client.id)
    }

    getAllListClients():Observable<any>{
        return this.http.get(this.url + "/v1/client/findall");
    }

    addClient(client : Client){
        return  this.http.post(this.url + "/v1/client/create", client, this.httpOptions)   ;
    }

}
