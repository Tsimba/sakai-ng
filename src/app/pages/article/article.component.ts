import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { Product, ProductService } from '../service/product.service';
import { ArticleModel, ArticleModeleService } from '../service/article.service';
import { TabsModule } from "primeng/tabs";
import { Checkbox } from "primeng/checkbox";
import { FournisseurService } from '@/pages/service/fournisseur.service';
import { Fournisseur } from '@/models/fournisseur';
import { Conditionnement } from '@/models/conditionnement';
import { PrixType } from '@/models/prixtype';
import { Prix } from '@/models/prix';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-article',
    standalone: true,
    imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    TabsModule,
    Checkbox
],
    templateUrl:'./article.component.html',
    styleUrls: ['./article.component.scss'],

    providers: [MessageService, ArticleModeleService, ConfirmationService]
})
export class ArticleComponent implements OnInit {
    articleDialog: boolean = false;
    pDialog: boolean = false;

    articles = signal<ArticleModel[]>([]);

    article!: ArticleModel;

    selectedArticles!: ArticleModel[] | null;

    submitted: boolean = false;

    statuses!: any[];

    familles!: any[];

    fournisseurList!: Fournisseur[];

    articleList!: ArticleModel[];

    listArticles = signal<ArticleModel[]>([]);

    listBottle!:ArticleModel[];
    listCageot!:ArticleModel[];

    emballage!: string;
    cageot!:string;

    errorMessage?: string;

    type!: any[];

    categories!: any[];

    cageots!: any[];

    articleTmp!: ArticleModel;

    prixtypeList!: PrixType[];

    prixtype: PrixType[] = [];

    listPrix: Prix[] = [];

    conditionnement: Conditionnement = new Conditionnement();

    @ViewChild('dt') dt!: Table;

    // index: number = 0;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private articleService: ArticleModeleService,
        private fournisseurService : FournisseurService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.getAllListArticles();
        this.getFournisseur();
        this.getBoouteillesList();
        this.getCageotList();
        this.getArticleByCategory();
        this.loadDemoData();
         this.getPrixTypeList();
    }

    loadDemoData() {
        this.statuses = [
            { label: 'STAR', value: 'star' },
            { label: 'SODEAM', value: 'sodeam' },
            { label: 'COMADIS', value: 'comadis' },
            { label: 'DZAMA', value: 'dzama' },
            { label: 'AUTRES', value: 'autres' }
        ];

        this.type = [
            { message: 'BOISSON ALCOOLIQUE', code: 'BA' },
            { message: 'BOISSON HYGIENIQUE', code: 'BH' },
            { message: 'CONDITIONNEMENT', code: 'CD' }
        ];

        this.categories = [
            { label: 'Conditionnements', value: 'conditionnements' },
            { label: 'Produits finis', value: 'produits' },
            { label: 'Emballages', value: 'emballages' }
        ];

        this.cageots = [
            { label: 'Cageot Star', value: 'cgtstar' },
            { label: 'Cageot Commadis', value: 'cgtcom' },
            { label: 'Cageot Dzama', value: 'cgtdz' },
            { label: 'Cageot Sodeam', value: 'cgtsod' },
            { label: 'Pack', value: 'pack' },
            { label: 'Carton', value: 'crt' },

        ];


        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }


    getAllListArticles(){
        this.articleService.getAllListArticles().subscribe({
            next:(response) => {
                console.log("responseARticle=>", response)
                this.listArticles.set(response)
                console.log("Listes All Articles===>", this.listArticles)
            }
        });
    }

    getPrixTypeList(){
        this.articleService.getPrixTypeList().subscribe({
             next: (response) => {
                  this.prixtypeList = response;
                  this.createNewPrixList(this.prixtypeList);
               },
               error: (err) => {
                   console.error('Erreur lors List PrixType :', err);
               }
        });
    }

    createNewPrixList(listPrixType : PrixType[]){
        for(let prixtype of listPrixType){
             let prix = new Prix();
             prix.type = prixtype;
             this.listPrix.push(prix);
        }
    }



    getFournisseur(){
       this.fournisseurService.getAllFournisseur().subscribe({
               next: (response) => {
                  this.fournisseurList = response;
               },
               error: (err) => {
                   console.error('Erreur lors List Fournisseur :', err);
               }
           }
       );
    }

    getArticleByCategory(){
        this.articleService.getArticleByCategory("Emballages").subscribe(
            {
            next: (data) => {
                this.articleList = data;
                console.log("Articles reçus :", data);
            },
            error: (err) => {
                console.error("Erreur lors de l'appel API :", err);
            }
            }
        );
    }

    getBoouteillesList(){
        this.articleService.getArticleByCategoryAndType("Emballages", "CD").subscribe(
            {
            next: (data) => {
                this.listBottle = data;
            },
            error: (err) => {
                console.error("Erreur lors de l'appel API :", err);
            }
            }
        );
    }

    getCageotList(){
        this.articleService.getArticleByCategoryAndType("Conditionnements", "CD").subscribe(
            {
            next: (data) => {
                this.listCageot = data;
            },
            error: (err) => {
                console.error("Erreur lors de l'appel API :", err);
            }
            }
        );
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.article = {};
        this.submitted = false;
        this.articleDialog = true;
    }
    openNewDialog() {
        this.article = {};
        this.conditionnement.articleBtl = null;
        this.conditionnement.articleCgt = null;
        this.conditionnement.nbreBtl = 0;
        this.submitted = false;
        this.pDialog = true;
    }

    onPrixChange(valeur: number, i: number) {
        if (!this.listPrix[i]) {
            this.listPrix[i] = { valeur: 0 }; // tu peux mettre d'autres champs si besoin
        }
        this.listPrix[i].valeur = valeur;
    }

    editProduct(product: ArticleModel) {
        this.conditionnement.articleBtl = null;
        this.conditionnement.articleCgt = null;
        this.conditionnement.nbreBtl = 0;
        this.article = { ...product };
        this.pDialog = true;
        if(this.article.condition != undefined || this.article.condition != null){
            this.conditionnement = this.article.condition;
        }
        console.log("EDIT ARTICLE====>", this.article);

        if(this.article.prixList != undefined || this.article.prixList != null ){
            if(this.article.prixList.length != 0){
                for(let prix of  this.article.prixList){
                    if(this.listPrix === undefined ||  this.listPrix === null){
                        this.listPrix = [];
                        this.listPrix.push(prix);
                    } else {
                        console.log("MIS VALL")
                        const price = this.listPrix.find(p => p.type?.code === prix.type?.code);
                        if(price){
                            price.id = prix.id;
                            price.valeur = prix.valeur;
                        }
                    }


                }
            } else {
                console.log("this.article.prixList====>", this.article.prixList);
                console.log("this.listPrix====>", this.listPrix);
                for(let prix of this.listPrix){
                    prix.valeur = 0;
                    prix.id = undefined;
                    // prix.article = new ArticleModel();
                }
            }

            console.log("LIST PRIX====>", this.listPrix);

        } else {
            console.log("prixList===>", this.article.prixList)
            this.listPrix = [];
            // this.listPrix =

        }

    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected article?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.articles.set(this.articles().filter((val) => !this.selectedArticles?.includes(val)));
                this.selectedArticles = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Article Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.pDialog = false;
        this.submitted = false;
    }

    deleteArticle(article: ArticleModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + article.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.articleService.deleteArticle(article).subscribe({
                    next: () => {
                        this.getAllListArticles()
                        this.article = {};
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Deleted',
                            life: 3000
                        });
                    }

                });
            }
        });
    }

    deleteProduct(article: ArticleModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + article.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.articles.set(this.articles().filter((val) => val.id !== article.id));
                this.article = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.articles().length; i++) {
            // if (this.articles()[i].id === id) {
            //     index = i;
            //     break;
            // }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: boolean) {
        switch (status) {
            case true:
                return 'success';
            default:
                return 'warn';
        }
    }

    getValueStatus(status: boolean){
        switch (status) {
            case true:
                return 'ACTIF';
            default:
                return 'INACTIF';
        }
    }

    saveArticle(){
        this.submitted = true;
        if(this.conditionnement !== null){
            this.article.condition = this.conditionnement;
        }
        this.article.prixList = this.listPrix;
        console.log("this.article==+>" , this.article)
        if(this.article.name?.trim() && this.article.code?.trim()){
            this.articleService.addArticle(this.article)
                .subscribe({
                        next: (response) => {
                            console.log('Article créé avec succès!', response);
                            this.articleTmp = response;
                            if(this.articleTmp.conditionnement === 'Conditionnements'){
                                this.getCageotList();
                            } else if(this.articleTmp.conditionnement === 'Emballages'){
                                this.getBoouteillesList()        ;
                            }
                            this.getAllListArticles();
                            // Réinitialiser le formulaire
                            this.pDialog = false;
                            this.article = {};
                        },
                        error: (err) => {
                            console.error('Erreur lors de la création de l\'article :', err);
                            alert('Erreur: ' + err.message);
                        }
                    }
                );
        }

    }

    saveProduct() {
        this.submitted = true;
        let _products = this.articles();
        if (this.article.name?.trim()) {
            if (this.article.id) {
                // _products[this.findIndexById(this.article.id)] = this.article;
                this.articles.set([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                // this.article.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                this.articles.set([..._products, this.article]);
            }

            this.articleDialog = false;
            this.article = {};
        }
    }
}
