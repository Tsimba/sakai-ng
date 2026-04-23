import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
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
import {  InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabsModule } from "primeng/tabs";
import { ClientService } from '@/pages/service/clients.service';
import { Client } from '@/models/client';
import { FluidModule } from 'primeng/fluid';
import { ArticleModel, ArticleModeleService } from '@/pages/service/article.service';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import { AutoFocus } from 'primeng/autofocus';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Dialog } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { Emballages } from '@/models/emballages';
import { Listbox } from 'primeng/listbox';
import { Checkbox } from 'primeng/checkbox';

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
    selector: 'app-client',
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
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        TabsModule,
        MessageModule,
        ToastModule,
        FluidModule,
        FloatLabel,
        DatePicker,
        AutoFocus,
        AutoComplete,
        Dialog,
        // Listbox
        // Checkbox
    ],
    templateUrl: './facture.component.html',
    styleUrls: ['./facture.component.scss'],

    providers: [MessageService, ClientService, ConfirmationService]
})
export class FactureComponent implements OnInit {
    pDialog: boolean = false;

    client!: Client;

    selectedArticle!: ArticleModel[] | null;

    submitted: boolean = false;

    statuses!: any[];

    listArticles: ArticleModel[] = [];

    type!: any[];

    @ViewChild('dt') dt!: Table;
    @ViewChild('inputCgt') monChampInputNumber!: ElementRef;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    date: Date = new Date();

    filteredClients: any | undefined;

    filteredArticles: any | undefined;

    selectedClients: any;

    prixBtl: number | undefined = 0;

    articleFind!: ArticleModel;

    nameArticle!: ArticleModel;
    cageot: any;
    piece: any;
    ngCdt: any;
    isResetCgt: boolean = false;

    conditionnement!: any[];

    cndtSelected: any;

    dropdownItems = [
        { name: 'Gros', value: 'GROS' },
        { name: 'Star', value: 'STAR' },
        { name: 'Detail', value: 'DETAIL' }
    ];

    dropdownItem: string = 'GROS';

    constructor(
        private clientService: ClientService,
        private articleService: ArticleModeleService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.getAllClients();
        this.loadDemoData();
        this.conditionnement = [
            { name: 'Cageot', code: 'cgt' },
            { name: 'Pièce', code: 'pce' }
        ];
    }

    openNewDialog() {
        console.log('this.selectedClients', this.selectedClients);
        if (this.selectedClients == '' || this.selectedClients == null || this.selectedClients == undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'WARNING',
                detail: 'Client non séléctionné'
            });
        } else {
            this.nameArticle = {};
            this.piece = '';
            this.submitted = false;
            this.pDialog = true;
        }
    }

    hideDialog() {
        this.pDialog = false;
        this.submitted = false;
    }

    searchByName(event: AutoCompleteCompleteEvent) {
        let query = event.query;
        this.clientService.searchByName(query).subscribe({
            next: (data) => {
                this.filteredClients = data;
            },
            error: (err) => {
                console.error("Erreur lors de l'appel API :", err);
            }
        });
    }

    filterArticleByName(event: AutoCompleteCompleteEvent) {
        let query = event.query;
        this.articleService.filterByName(query, 'Produits finis').subscribe({
            next: (data) => {
                this.filteredArticles = data;
                console.log('this.filteredArticles===>', this.filteredArticles);
            },
            error: (err) => {
                console.error("Erreur lors de l'appel API :", err);
            }
        });
    }

    loadDemoData() {
        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    getAllClients() {}

    deleteSelectedProducts() {}

    isEmpty(obj: any): boolean {
        return !obj || Object.keys(obj).length === 0;
    }

    isArticle(obj: any): obj is ArticleModel {
        return obj && typeof obj === 'object' && 'name' in obj && 'condition' in obj;
    }

    onCalcul(nbreCagt: any, article: any) {
        article.tempPiece = nbreCagt * article.condition.nbreBtl;
        // @ts-ignore
        article.prixArticle = article.tempPiece * this.getPrix(article);
    }

    onCalculePrixArticle(article: any) {
        // @ts-ignore
        article.prixArticle = article.tempPiece * this.getPrix(article);
        this.isResetCgt = true;
    }

    onBlurCalculPiece(article: any) {
        console.log('this.isResetCgt===> onBlurCalculPiece', this.isResetCgt);
        // @ts-ignore
        article.emballage.piece = article.tempPiece;

        if (this.isResetCgt) {
            article.emballage.cageot = 0;
            console.log('article.emballage==>', article);
            this.isResetCgt = false;
        }
    }

    getPrix(article: ArticleModel): number | undefined {
        if (!article.prixList || !this.dropdownItem) {
            return undefined;
        }
        return article.prixList.find((p) => p.type?.code === this.dropdownItem)?.valeur;
    }

    // @ts-ignore
    formatMontant(val: number | undefined): string {
        if (val) return val.toLocaleString('fr-FR'); // espace
    }

    findPriceConditionById(id: number | undefined) {
        this.articleService.findArticleById(id).subscribe({
            next: (data) => {
                this.articleFind = data;
                this.nameArticle.prixBtl = this.getPrix(this.articleFind);
                console.log('ARTICLE VAL===>', this.nameArticle);
                // this.prixBtl = this.getPrix(this.articleFind);
            },
            error: (err) => {
                console.error("Erreur lors de l'appel API :", err);
            }
        });
    }
    // getPriceByArticle(article: ArticleModel){
    //     this.findArticleById(article);
    //     return this.getPrix(this.articleFind);
    // }

    AddFacture() {
        // console.log('selected Cond===>', this.cndtSelected.code);
        if (this.selectedClients == '' || this.selectedClients == null || this.selectedClients == undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'WARNING',
                detail: 'Client non séléctionné'
            });
        } else if (this.isEmpty(this.nameArticle)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: 'Veuillez sélectionner un article'
            });
        } else if (this.isEmpty(this.filteredArticles)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: 'Veuillez sélectionner un article'
            });
        } else if (!this.isArticle(this.nameArticle)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: 'Séléctionner bien un article...'
            });
        } else {
            if (!this.listArticles.find((article) => article.id == this.nameArticle.id)) {
                this.nameArticle.emballage = new Emballages();
                this.findPriceConditionById(this.nameArticle.condition?.articleBtl);
                console.log('this.nameArticl===>', this.nameArticle);
                this.submitted = true;
                this.pDialog = false;
                this.dt.initRowEdit(this.nameArticle);
                // this.dt.onE
                this.listArticles.push(this.nameArticle);
                this.nameArticle = {};
                // this.focusNext();
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'WARNING',
                    detail: 'Article déjà dans la liste'
                });
            }
        }
    }
    protected onEditInit(event: any) {
        setTimeout(() => {
            const td = event.originalEvent?.target?.closest('td');

            if (!td) return;

            const input = td.querySelector('input, textarea') as HTMLElement;

            if (input) {
                input.focus();

                // Simuler un vrai clic utilisateur
                input.dispatchEvent(
                    new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    })
                );

                // optionnel : sélectionner le texte
                (input as HTMLInputElement).select?.();
            }
        });
    }

    protected readonly event = event;
}
