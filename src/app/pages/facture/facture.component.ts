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
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabsModule } from "primeng/tabs";
import { ClientService } from '@/pages/service/clients.service';
import { Client } from '@/models/client';
import { FluidModule } from 'primeng/fluid';
import { ArticleModel } from '@/pages/service/article.service';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import { AutoFocus } from 'primeng/autofocus';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';

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
        // Message,
        FluidModule,
        FloatLabel,
        DatePicker,
        AutoFocus,
        AutoComplete
        // Checkbox
    ],
    templateUrl: './facture.component.html',
    styleUrls: ['./facture.component.scss'],

    providers: [MessageService, ClientService, ConfirmationService]
})
export class FactureComponent implements OnInit {
    articles = signal<ArticleModel[]>([]);

    client!: Client;

    selectedArticle!: ArticleModel[] | null;

    submitted: boolean = false;

    statuses!: any[];

    listArticles: ArticleModel[] = [];

    type!: any[];

    categories!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    date: Date = new Date();

    private tempIdCounter = 1;

    filteredClients: any | undefined;

    selectedClients: any;

    dropdownItems = [
        { name: 'Gros', code: 'Option 1' },
        { name: 'Star', code: 'Option 2' },
        { name: 'Detail', code: 'Option 3' }
    ];

    dropdownItem = null;

    constructor(
        private clientService: ClientService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.getAllClients();
        this.loadDemoData();
    }

    addRow() {
        this.listArticles.push({ id: this.tempIdCounter++, name: '' });
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

    onGlobalFilter(table: Table, event: Event) {
        console.log('table====>', table);
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    editClient(client: Client) {
        this.client = { ...client };
    }

    deleteSelectedProducts() {}

    deleteClient(client: Client) {}

    getSeverity(status: boolean) {
        switch (status) {
            case true:
                return 'success';
            default:
                return 'warn';
        }
    }

    getValueStatus(status: boolean) {
        switch (status) {
            case true:
                return 'ACTIF';
            default:
                return 'INACTIF';
        }
    }

    saveClient() {}
}
