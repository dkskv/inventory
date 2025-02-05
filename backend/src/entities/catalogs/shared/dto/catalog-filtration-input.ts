import { InputType, Field } from '@nestjs/graphql';
import { CatalogFiltration } from '../service/catalog-entity.service';

@InputType()
export class CatalogFiltrationInput implements CatalogFiltration {
  @Field({ nullable: true })
  searchText?: string;
}
