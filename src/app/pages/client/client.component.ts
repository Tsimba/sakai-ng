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
import { TabsModule } from "primeng/tabs";
import { Checkbox } from "primeng/checkbox";
import { ClientService } from '@/pages/service/clients.service';
import { Client } from '@/models/client';
import { Message } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';

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
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        TabsModule,
        // Message,
        FluidModule
        // Checkbox
    ],
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],

    providers: [MessageService, ClientService, ConfirmationService]
})
export class ClientComponent implements OnInit {
    pDialog: boolean = false;

    articles = signal<Client[]>([]);

    client!: Client;

    selectedClient!: Client[] | null;

    submitted: boolean = false;

    statuses!: any[];

    listClients = signal<Client[]>([]);

    type!: any[];

    categories!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

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

    getAllClients() {
        this.clientService.getAllListClients().subscribe({
            next: (response) => {
                console.log('responseARticle=>', response);
                this.listClients.set(response);
                console.log('Listes All Articles===>', this.listClients);
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        console.log("table====>", table)
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNewDialog() {
        this.client = {};
        this.submitted = false;
        this.pDialog = true;
    }

    editClient(client: Client) {
        this.client = { ...client };
        this.pDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected article?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.articles.set(this.articles().filter((val) => !this.selectedClient?.includes(val)));
                this.selectedClient = null;
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

    deleteClient(client: Client) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + client.lastname + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.clientService.deleteClient(client).subscribe({
                    next: () => {
                        this.getAllClients();
                        this.client = {};
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Client Deleted',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

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

    saveClient() {
        this.submitted = true;

        if (this.client.firstName?.trim() && this.client.lastname?.trim()) {
            this.clientService.addClient(this.client).subscribe({
                next: (response) => {
                    this.getAllClients();
                    // Réinitialiser le formulaire
                    this.pDialog = false;
                    this.client = {};
                },
                error: (err) => {
                    console.error("Erreur lors de la création de l'article :", err);
                    alert('Erreur: ' + err.message);
                }
            });
        }
    }
}
