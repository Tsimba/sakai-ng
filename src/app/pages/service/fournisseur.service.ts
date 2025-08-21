import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '@/models/fournisseur';

@Injectable({ providedIn: 'root' })
export class FournisseurService {
    protected url:string = environment.hubApiURL;
        httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };

        constructor(
            private http: HttpClient
        ) {}


    getAllFournisseur():Observable<Fournisseur[]> {
        return this.http.get<Fournisseur[]>(this.url + "/v1/fournisseur/getall", this.httpOptions);
    }

}
