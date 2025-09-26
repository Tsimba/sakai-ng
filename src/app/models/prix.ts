import { ArticleModel } from "@/pages/service/article.service";
import { PrixType } from "./prixtype";

export class Prix{
    id?: number | undefined;
    article?: ArticleModel;
    type?: PrixType;
    valeur?: number;
}
