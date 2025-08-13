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

    errorMessage?: string;

    familles!: any[];

    categories!: any[];

    cageots!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private articleService: ArticleModeleService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.articleService.getArticles().then((data) => {
            this.articles.set(data);
        });

        this.statuses = [
            { label: 'STAR', value: 'star' },
            { label: 'SODEAM', value: 'sodeam' },
            { label: 'COMADIS', value: 'comadis' },
            { label: 'DZAMA', value: 'dzama' },
            { label: 'AUTRES', value: 'autres' }
        ];

        this.familles = [
            { label: 'BOISSON ALCOOLIQUE', value: 'alcoolique' },
            { label: 'BOISSON HYGIENIQUE', value: 'hygienique' },
            { label: 'CONDITIONNEMENT', value: 'conditionnement' }
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
        this.submitted = false;
        this.pDialog = true;
    }

    editProduct(product: ArticleModel) {
        this.article = { ...product };
        this.articleDialog = true;
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
        this.articleDialog = false;
        this.submitted = false;
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
            if (this.articles()[i].id === id) {
                index = i;
                break;
            }
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

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    saveArticle(){
        this.articleService.addArticle(this.article)
        .subscribe({
             next: (response) => {
        console.log('Article créé avec succès!', response);
        alert('Article créé!');
        // Réinitialiser le formulaire
            this.articleDialog = false;
            this.article = {};
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'article :', err);
        alert('Erreur: ' + err.message);
      }   
        }
           
        );
    }

    saveProduct() {
        this.submitted = true;
        let _products = this.articles();
        if (this.article.name?.trim()) {
            if (this.article.id) {
                _products[this.findIndexById(this.article.id)] = this.article;
                this.articles.set([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.article.id = this.createId();
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
